import os, json, uuid, boto3, datetime
s3=boto3.client("s3"); ddb=boto3.resource("dynamodb").Table(os.environ["DDB_TABLE"])
BUCKET=os.environ["EVIDENCE_BUCKET"]
REQUIRED=json.loads(os.environ.get("REQUIRED_DOCS",'["receipt","id_scan"]'))

def _resp(c,o): return {"statusCode":c,"headers":{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"},"body":json.dumps(o)}
def _puturl(key,ctype="application/octet-stream"):
    return s3.generate_presigned_url("put_object", Params={"Bucket":BUCKET,"Key":key,"ContentType":ctype}, ExpiresIn=900)

def lambda_handler(e,_):
    tx_id = (e.get("pathParameters") or {}).get("txId") or (e.get("pathParameters") or {}).get("id")
    now = datetime.datetime.utcnow().isoformat()
    # tạo item VERIF (idempotent)
    ddb.update_item(
        Key={"transactionId": f"VERIF#{tx_id}"},
        UpdateExpression="SET #t=:t, #st=:st, requiredDocs=:req, createdAt=:ts ADD history :h",
        ExpressionAttributeNames={"#t":"type","#st":"status"},
        ExpressionAttributeValues={
            ":t":"VERIF",":st":"PENDING_DOCS",":req":REQUIRED,":ts":now,
            ":h": set([json.dumps({"at":now,"evt":"REQUEST_CREATED"})])
        }
    )
    # phát URL upload cho từng docType
    uploads=[]
    for dt in REQUIRED:
        doc_id=str(uuid.uuid4())
        key=f"evidence/tx={tx_id}/doc={doc_id}-{dt}"
        uploads.append({"docType":dt,"docId":doc_id,"s3Key":key,"putUrl":_puturl(key)})
    return _resp(200,{"ok":True,"txId":tx_id,"uploads":uploads})
