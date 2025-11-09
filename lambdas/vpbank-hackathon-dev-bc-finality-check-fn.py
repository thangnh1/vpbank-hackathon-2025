import os, json, boto3, urllib.request
TABLE=os.environ["DDB_TABLE"]; VERIFY=os.environ.get("FABRIC_VERIFY_URL")
ddb=boto3.resource("dynamodb").Table(TABLE)

def lambda_handler(event,_):
    resp = ddb.scan(FilterExpression="#t=:tx AND attribute_exists(txHash) AND (attribute_not_exists(verified) OR verified<>:v)",
                    ExpressionAttributeNames={"#t":"type"},
                    ExpressionAttributeValues={":tx":"TX",":v":True})
    updated=0
    for it in resp.get("Items", []):
        ok = _verify(it["txHash"])
        ddb.update_item(Key={"transactionId": it["transactionId"]},
                        UpdateExpression="SET verified=:v",
                        ExpressionAttributeValues={":v": bool(ok)})
        updated += 1
    return {"ok":True,"checked":len(resp.get("Items",[])),"updated":updated}

def _verify(h):
    if not VERIFY: return True  
    with urllib.request.urlopen(f"{VERIFY}?hash={h}", timeout=10) as r:
        data=json.loads(r.read().decode())
    return bool(data.get("verified"))
