import os, json, boto3
TABLE=os.environ["DDB_TABLE"]; ddb=boto3.resource("dynamodb").Table(TABLE)
def resp(c,o): return {"statusCode":c,"headers":{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"},"body":json.dumps(o)}
def lambda_handler(e,_):
    tx_id = (e.get("pathParameters") or {}).get("id")
    r = ddb.get_item(Key={"transactionId": tx_id})
    return resp(200, {"ok":True,"item":r.get("Item")}) if "Item" in r else resp(404, {"ok":False,"error":"not_found"})
