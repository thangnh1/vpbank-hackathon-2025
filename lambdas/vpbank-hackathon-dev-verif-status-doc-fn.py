import os, json, boto3
ddb=boto3.resource("dynamodb").Table(os.environ["DDB_TABLE"])
def _resp(c,o): return {"statusCode":c,"headers":{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"},"body":json.dumps(o)}
def lambda_handler(e,_):
    tx_id=(e.get("pathParameters") or {}).get("txId")
    r=ddb.get_item(Key={"transactionId": f"VERIF#{tx_id}"})
    if "Item" not in r: return _resp(404, {"ok":False,"error":"not_found"})
    return _resp(200, {"ok":True, "verification": r["Item"]})
