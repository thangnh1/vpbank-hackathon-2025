import json, os, boto3, base64, traceback
ddb = boto3.client("dynamodb")
TABLE = os.environ.get("DDB_TABLE")

def lambda_handler(event, _):
    handled = 0
    for m in event.get("Records", []):
        try:
            body = json.loads(m["body"])
            raw = body.get("original_event") or body.get("detail") or body
            print("DLQ_RECORD:", json.dumps(raw)[:1000])
            if TABLE:
                ddb.put_item(TableName=TABLE, Item={
                    "transactionId":{"S":f"DLQ#{m['messageId']}"},
                    "type":{"S":"DLQ"},
                    "payload":{"S":json.dumps(raw)[:380000]}
                })
            handled += 1
        except Exception as e:
            print("DLQ_ERR", repr(e)); print(traceback.format_exc())
    return {"ok": True, "handled": handled}
