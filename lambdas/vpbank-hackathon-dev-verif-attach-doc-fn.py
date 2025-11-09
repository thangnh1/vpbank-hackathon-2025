import os, json, boto3, datetime
ddb=boto3.resource("dynamodb").Table(os.environ["DDB_TABLE"])

def _resp(c,o): return {"statusCode":c,"headers":{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"},"body":json.dumps(o)}

def lambda_handler(e,_):
    tx_id = (e.get("pathParameters") or {}).get("txId")
    body = json.loads(e.get("body") or "{}")  # {docId, docType, s3Key, originalName, sha256?}
    verif_pk = f"VERIF#{tx_id}"
    now = datetime.datetime.utcnow().isoformat()

    # thêm doc vào mảng docs[]
    r = ddb.update_item(
        Key={"transactionId": verif_pk},
        UpdateExpression="SET docs = list_append(if_not_exists(docs, :empty), :d), #st = if_not_exists(#st,:pd), lastUpdated=:ts ADD history :h",
        ExpressionAttributeNames={"#st":"status"},
        ExpressionAttributeValues={
            ":d":[body], ":empty":[], ":pd":"PENDING_DOCS", ":ts":now,
            ":h": set([json.dumps({"at":now,"evt":"DOC_ATTACHED","docType":body.get("docType")})])
        },
        ReturnValues="ALL_NEW"
    )
    docs = r["Attributes"].get("docs",[])
    req  = r["Attributes"].get("requiredDocs",[])
    have = set(d.get("docType") for d in docs)
    status = "PENDING_REVIEW" if set(req).issubset(have) else r["Attributes"]["status"]
    if status != r["Attributes"]["status"]:
        ddb.update_item(Key={"transactionId": verif_pk},
                        UpdateExpression="SET #st=:st, lastUpdated=:ts ADD history :h",
                        ExpressionAttributeNames={"#st":"status"},
                        ExpressionAttributeValues={":st":"PENDING_REVIEW", ":ts":now,
                          ":h": set([json.dumps({"at":now,"evt":"READY_FOR_REVIEW"})])})
    return _resp(200, {"ok":True,"status":status,"have":list(have),"required":req})
