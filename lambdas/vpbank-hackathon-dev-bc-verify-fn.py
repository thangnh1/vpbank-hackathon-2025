import os, json, urllib.request, boto3
TABLE=os.environ["DDB_TABLE"]; VERIFY_URL=os.environ.get("FABRIC_VERIFY_URL")
ddb=boto3.resource("dynamodb").Table(TABLE)

def lambda_handler(event,_):
    tx_id = (event.get("pathParameters") or {}).get("id")
    r = ddb.get_item(Key={"transactionId": tx_id})
    item = r.get("Item")
    if not item or "txHash" not in item:
        return {"statusCode":404,"body":json.dumps({"ok":False,"error":"no_txhash"})}

    if not VERIFY_URL:
        return {"statusCode":200,"body":json.dumps({"ok":True,"verified":True,"mode":"stub","txHash":item["txHash"]})}

    with urllib.request.urlopen(f"{VERIFY_URL}?hash={item['txHash']}", timeout=10) as resp:
        data=json.loads(resp.read().decode())
    return {"statusCode":200,"body":json.dumps({"ok":True,"verified":bool(data.get('verified')), "txHash":item["txHash"]})}
