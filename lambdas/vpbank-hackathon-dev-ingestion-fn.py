import json, base64, os, traceback

STREAM = os.environ.get("STREAM_NAME")

def _resp(code, payload):
    return {
        "statusCode": code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type,x-api-key",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        },
        "body": json.dumps(payload),
    }

def _parse_event(e):
    try:
        print("EVENT:", json.dumps(e) if isinstance(e, dict) else str(e))
    except Exception:
        print("EVENT_PRINT_FAILED")

    if isinstance(e, dict) and "body" in e:
        body = e.get("body")
        if e.get("isBase64Encoded"):
            body = base64.b64decode(body).decode("utf-8")
        if isinstance(body, str):
            try:
                return json.loads(body)
            except Exception:
                return body
        return body

    if isinstance(e, dict):
        return e
    if isinstance(e, str):
        try:
            return json.loads(e)
        except Exception:
            return e

    return None

def lambda_handler(event, context):
    try:
        payload = _parse_event(event)

        if not isinstance(payload, dict):
            return _resp(400, {
                "ok": False,
                "error": "missing_or_invalid_body",
                "tip": "On console, use the 'API Gateway AWS Proxy' test template and put JSON in 'body'.",
                "echo": payload
            })

        txn_id = payload.get("transactionId")
        if not txn_id:
            return _resp(400, {"ok": False, "error": "transactionId_required"})

        import boto3
        kinesis = boto3.client("kinesis")
        try:
            resp = kinesis.put_record(
                StreamName=STREAM,
                PartitionKey=str(txn_id),
                Data=json.dumps(payload).encode("utf-8"),
            )
            print("PUT_OK", resp.get("ShardId"), resp.get("SequenceNumber"))
            return _resp(202, {"ok": True, "transactionId": txn_id})
        except Exception as e:
            print("PUT_ERR", repr(e)); print(traceback.format_exc())
            return _resp(502, {"ok": False, "error": "kinesis_put_failed"})
    except Exception as e:
        print("ERROR:", repr(e))
        print(traceback.format_exc())
        return _resp(500, {"ok": False, "error": "internal_error"})
