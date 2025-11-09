import os, json, base64, time, boto3, traceback

ddb = boto3.resource("dynamodb").Table(os.environ["DDB_TABLE"])

def _log(*a): 
    try: print(*a)
    except: pass

def _extract_data_b64(item):
    if isinstance(item, dict):
        kin = item.get("kinesis") or {}
        if "data" in kin:
            return kin["data"]
        if "data" in item:
            return item["data"]
    return None

def _process_one(item):
    data_b64 = _extract_data_b64(item)
    if not data_b64:
        raise ValueError("missing base64 data field")

    raw = base64.b64decode(data_b64).decode("utf-8")
    payload = json.loads(raw)

    txn_id = payload.get("transactionId")
    if not txn_id:
        raise ValueError("transactionId required")

    ts = payload.get("timestamp") or time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

    ddb.put_item(Item={
        "transactionId": txn_id,
        "timestamp": ts,
        "amount": payload.get("amount"),
        "currency": payload.get("currency"),
        "fromAccount": payload.get("fromAccount"),
        "toAccount": payload.get("toAccount"),
        "channel": payload.get("channel"),
        "meta": payload.get("metadata"),
        "status": "processed"
    })
    return {"ok": True, "transactionId": txn_id}

def lambda_handler(event, context):
    try:
        _log("EVENT_TYPE:", type(event).__name__)

        if isinstance(event, list):
            results, failed = [], 0
            for i, item in enumerate(event):
                try:
                    results.append(_process_one(item))
                except Exception as e:
                    failed += 1
                    _log(f"ERR[{i}]:", repr(e))
                    _log(traceback.format_exc())
                    results.append({"ok": False, "error": str(e)})
            return {"ok": failed == 0, "count": len(results), "failed": failed, "results": results}

        elif isinstance(event, dict):
            res = _process_one(event)
            return {"ok": True, **res}

        else:
            return {"ok": False, "error": f"unsupported event type: {type(event).__name__}"}

    except Exception as e:
        _log("FATAL_ERR:", repr(e))
        _log(traceback.format_exc())
        return {"ok": False, "error": "internal_error"}
