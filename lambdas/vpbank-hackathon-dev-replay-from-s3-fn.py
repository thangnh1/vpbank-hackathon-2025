import os, json, boto3
from decimal import Decimal
s3 = boto3.client("s3"); ddb = boto3.client("dynamodb")
BUCKET = os.environ["EVIDENCE_BUCKET"]; TABLE = os.environ["DDB_TABLE"]

def lambda_handler(e,_):
    body = json.loads(e.get("body") or "{}") if isinstance(e,dict) else e
    prefix = body.get("prefix")
    if not prefix: return _resp(400,{"error":"prefix required"})
    keys = _list_keys(prefix)
    ok = 0; dup = 0; fail = 0
    for k in keys:
        obj = s3.get_object(Bucket=BUCKET, Key=k)
        tx = json.loads(obj["Body"].read().decode("utf-8"), parse_float=Decimal)
        try:
            _upsert_tx_and_agg(tx)
            ok += 1
        except ddb.exceptions.TransactionCanceledException:
            dup += 1
        except Exception as ex:
            print("REPLAY_ERR", k, repr(ex)); fail += 1
    return _resp(200, {"ok":True,"prefix":prefix,"processed":ok,"dups":dup,"failed":fail})

def _upsert_tx_and_agg(tx):
    txn_id = tx["transactionId"]; amt = Decimal(str(tx.get("amount",0)))
    fund  = tx.get("fundId","default"); ts = tx.get("timestamp")
    agg_pk = f"AGG#FUND#{fund}"
    ddb.transact_write_items(TransactItems=[
        {"Put":{"TableName":TABLE,"Item":{
            "transactionId":{"S":txn_id},"type":{"S":"TX"},"fundId":{"S":fund},
            "amount":{"N":str(amt)},"currency":{"S":tx.get("currency","VND")},
            "fromAccount":{"S":tx.get("fromAccount","")},"toAccount":{"S":tx.get("toAccount","")},
            "timestamp":{"S":ts or ""},"channel":{"S":tx.get("channel","")},
            "metadata":{"S":json.dumps(tx.get("metadata",{}))}
        },"ConditionExpression":"attribute_not_exists(transactionId)"}},
        {"Update":{"TableName":TABLE,"Key":{"transactionId":{"S":agg_pk}},
            "UpdateExpression":"SET totalVND=if_not_exists(totalVND,:z)+:a, lastUpdated=:ts, #t=:agg",
            "ExpressionAttributeValues":{":z":{"N":"0"},":a":{"N":str(amt)},":ts":{"S":ts or ""},":agg":{"S":"AGG"}},
            "ExpressionAttributeNames":{"#t":"type"}}}
    ])

def _list_keys(prefix):
    ks=[]; token=None
    while True:
        resp=s3.list_objects_v2(Bucket=BUCKET, Prefix=prefix, ContinuationToken=token) if token else s3.list_objects_v2(Bucket=BUCKET, Prefix=prefix)
        for it in resp.get("Contents", []): ks.append(it["Key"])
        if not resp.get("IsTruncated"): break
        token=resp.get("NextContinuationToken")
    return ks

def _resp(c,o): return {"statusCode":c,"headers":{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"},"body":json.dumps(o)}
