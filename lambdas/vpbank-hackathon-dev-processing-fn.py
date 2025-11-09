import os, json, base64, datetime
import boto3
from decimal import Decimal
from botocore.exceptions import ClientError

TABLE      = os.environ["DDB_TABLE"]                      # vpbank-hackathon-warehouse-dev
S3_BUCKET  = os.environ["S3_BUCKET"]                      # data lake
S3_PREFIX  = os.environ.get("S3_PREFIX", "raw/")
ddb = boto3.client("dynamodb")
s3  = boto3.client("s3")

def _dec(n): return Decimal(str(n))

def _put_raw(data_str, txn_id, seq, ts):
    day = (ts or datetime.datetime.utcnow().isoformat())[:10]
    key = f"{S3_PREFIX}date={day}/txn={txn_id}/seq={seq}.json"
    s3.put_object(Bucket=S3_BUCKET, Key=key, Body=data_str.encode("utf-8"), ContentType="application/json")
    print("RAW->S3", key)

def lambda_handler(event, _):
    for rec in event.get("Records", []):
        data_str = base64.b64decode(rec["kinesis"]["data"]).decode("utf-8")
        tx = json.loads(data_str)

        txn_id  = tx["transactionId"]
        fund_id = tx.get("fundId", "default")
        amount  = _dec(tx.get("amount", 0))
        ts      = tx.get("timestamp") or datetime.datetime.utcnow().isoformat()

        _put_raw(data_str, txn_id, rec["kinesis"]["sequenceNumber"], ts)

        agg_pk = f"AGG#FUND#{fund_id}"
        try:
            ddb.transact_write_items(TransactItems=[
                { "Put": {
                    "TableName": TABLE,
                    "Item": {
                      "transactionId": {"S": txn_id},
                      "type":          {"S": "TX"},
                      "fundId":        {"S": fund_id},
                      "amount":        {"N": str(amount)},
                      "currency":      {"S": tx.get("currency","VND")},
                      "fromAccount":   {"S": tx.get("fromAccount","")},
                      "toAccount":     {"S": tx.get("toAccount","")},
                      "timestamp":     {"S": ts},
                      "channel":       {"S": tx.get("channel","")},
                      "metadata":      {"S": json.dumps(tx.get("metadata",{}))}
                    },
                    "ConditionExpression": "attribute_not_exists(transactionId)"
                }},
                { "Update": {
                    "TableName": TABLE,
                    "Key": {"transactionId": {"S": agg_pk}},
                    "UpdateExpression": "SET totalVND = if_not_exists(totalVND, :z) + :amt, lastUpdated=:ts, #t=:agg",
                    "ExpressionAttributeValues": {
                      ":z": {"N":"0"}, ":amt":{"N":str(amount)}, ":ts":{"S":ts}, ":agg":{"S":"AGG"}
                    },
                    "ExpressionAttributeNames": {"#t":"type"}
                }}
            ])
            print("TX OK", txn_id, "AGG+", amount, "fund", fund_id)
        except ClientError as e:
            if e.response.get("Error",{}).get("Code") == "ConditionalCheckFailedException":
                print("SKIP dup", txn_id)
            else:
                raise
