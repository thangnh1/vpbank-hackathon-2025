import os, json, boto3, hashlib, urllib.parse, datetime
s3=boto3.client("s3"); ddb=boto3.resource("dynamodb").Table(os.environ["DDB_TABLE"])
REQUIRED=json.loads(os.environ.get("REQUIRED_DOCS",'["receipt","id_scan"]'))

def lambda_handler(event,_):
    for rec in event["Records"]:
        b = rec["s3"]["bucket"]["name"]; k = urllib.parse.unquote(rec["s3"]["object"]["key"])
        if not k.startswith("evidence/"): continue
        tx_id = _extract_tx(k) 
        doc_id, doc_type = _extract_doc(k)
        obj = s3.get_object(Bucket=b, Key=k)
        body = obj["Body"].read()
        sha = hashlib.sha256(body).hexdigest()
        now = datetime.datetime.utcnow().isoformat()
        ddb.update_item(
            Key={"transactionId": f"VERIF#{tx_id}"},
            UpdateExpression="SET docs=list_append(if_not_exists(docs,:e), :d), lastUpdated=:ts, #t=:v ADD history :h",
            ExpressionAttributeNames={"#t":"type"},
            ExpressionAttributeValues={
                ":e":[], ":d":[{"docId":doc_id,"docType":doc_type,"s3Key":k,"sha256":sha}],
                ":ts":now, ":v":"VERIF", ":h": set([json.dumps({"at":now,"evt":"DOC_AUTO_INDEX","docType":doc_type})])
            }
        )
        item = ddb.get_item(Key={"transactionId": f"VERIF#{tx_id}"}).get("Item",{})
        have = {d.get("docType") for d in item.get("docs", [])}
        if set(REQUIRED).issubset(have) and item.get("status")!="PENDING_REVIEW":
            ddb.update_item(Key={"transactionId": f"VERIF#{tx_id}"},
                UpdateExpression="SET #st=:st", ExpressionAttributeNames={"#st":"status"},
                ExpressionAttributeValues={":st":"PENDING_REVIEW"})
    return {"ok": True}

def _extract_tx(key):
    parts=key.split("/")
    for p in parts:
        if p.startswith("tx="): return p.split("=",1)[1]
    return "unknown"
def _extract_doc(key):
    dn = key.split("/")[-1]  
    dv = dn.split("=",1)[1]
    doc_id, doc_type = dv.split("-",1)
    return doc_id, doc_type
