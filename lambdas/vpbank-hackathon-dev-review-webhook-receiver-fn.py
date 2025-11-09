import os, json, boto3, hmac, hashlib
ddb=boto3.resource("dynamodb").Table(os.environ["DDB_TABLE"])
SECRET=os.environ.get("WEBHOOK_SECRET","")  

def _resp(c,o): return {"statusCode":c,"headers":{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"},"body":json.dumps(o)}

def lambda_handler(e,_):
    if e.get("httpMethod")!="POST": return _resp(405,{"error":"POST only"})
    body = e.get("body") or "{}"
    if e.get("isBase64Encoded"): body = base64.b64decode(body).decode()
    if SECRET:
        sig = e.get("headers",{}).get("x-signature","")
        if not _valid(sig, body): return _resp(401, {"error":"bad signature"})
    data = json.loads(body) 
    verif_pk = f"VERIF#{data['txId']}"
    ddb.update_item(Key={"transactionId": verif_pk},
                    UpdateExpression="SET #st=:st, reason=:rs",
                    ExpressionAttributeNames={"#st":"status"},
                    ExpressionAttributeValues={":st": data.get("decision","APPROVE"), ":rs": data.get("reason","")})
    return _resp(200, {"ok":True})

def _valid(sig, body):
    mac = hmac.new(SECRET.encode(), body.encode(), hashlib.sha256).hexdigest()
    return hmac.compare_digest(sig, mac)
