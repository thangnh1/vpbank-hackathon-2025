import os, json, hashlib, urllib.request, boto3
TABLE=os.environ["DDB_TABLE"]; GATEWAY=os.environ.get("FABRIC_GATEWAY_URL")  # ví dụ http(s)://host/attest
TOKEN_SECRET=os.environ.get("GATEWAY_TOKEN_SECRET_ID")                        # tùy chọn Secrets Manager

ddb=boto3.resource("dynamodb").Table(TABLE); sm=boto3.client("secretsmanager")

def _token():
    if not TOKEN_SECRET: return None
    v=sm.get_secret_value(SecretId=TOKEN_SECRET)
    return v.get("SecretString")

def lambda_handler(event,_):
    tx_id = (event.get("pathParameters") or {}).get("id") or (event.get("transactionId"))
    r = ddb.get_item(Key={"transactionId": tx_id})
    item = r.get("Item"); 
    if not item: return {"statusCode":404, "body": json.dumps({"ok":False,"error":"not_found"})}

    norm = json.dumps(item, sort_keys=True, separators=(",",":")).encode()
    h = hashlib.sha256(norm).hexdigest()

    if not GATEWAY:  # demo stub
        ddb.update_item(Key={"transactionId":tx_id}, UpdateExpression="SET txHash=:h", ExpressionAttributeValues={":h": h})
        return {"statusCode":200, "body": json.dumps({"ok":True,"txHash":h,"mode":"stub"})}

    req = urllib.request.Request(GATEWAY, data=json.dumps({"hash":h,"id":tx_id}).encode(), headers={"Content-Type":"application/json"})
    tok=_token()
    if tok: req.add_header("Authorization", f"Bearer {tok}")
    with urllib.request.urlopen(req, timeout=10) as resp:
        data=json.loads(resp.read().decode())
    txhash = data.get("txHash", h)
    ddb.update_item(Key={"transactionId":tx_id}, UpdateExpression="SET txHash=:h", ExpressionAttributeValues={":h": txhash})
    return {"statusCode":200, "body": json.dumps({"ok":True,"txHash":txhash})}
