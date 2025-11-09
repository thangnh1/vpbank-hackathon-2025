import os, json, boto3, datetime
ddb=boto3.resource("dynamodb").Table(os.environ["DDB_TABLE"])
lam=boto3.client("lambda")
ATTEST=os.environ.get("ATTEST_LAMBDA_NAME")

def _resp(c,o): return {"statusCode":c,"headers":{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"},"body":json.dumps(o)}

def lambda_handler(e,_):
    tx_id = (e.get("pathParameters") or {}).get("txId")
    body  = json.loads(e.get("body") or "{}")
    decision = body.get("decision")
    reason   = body.get("reason","")
    reviewer = body.get("reviewer","manual")
    if decision not in ("APPROVE","REJECT"):
        return _resp(400, {"ok":False,"error":"invalid_decision"})

    verif_pk=f"VERIF#"+tx_id; now=datetime.datetime.utcnow().isoformat()
    ddb.update_item(
        Key={"transactionId": verif_pk},
        UpdateExpression="SET #st=:st, decidedBy=:rb, decidedAt=:ts, reason=:rs ADD history :h",
        ExpressionAttributeNames={"#st":"status"},
        ExpressionAttributeValues={
            ":st":decision, ":rb":reviewer, ":ts":now, ":rs":reason,
            ":h": set([json.dumps({"at":now,"evt":"DECISION","decision":decision,"by":reviewer})])
        }
    )

    txhash=None
    if decision=="APPROVE" and ATTEST:
        try:
            resp = lam.invoke(FunctionName=ATTEST, InvocationType="RequestResponse",
                              Payload=json.dumps({"transactionId": tx_id}).encode())
            out=json.loads(resp["Payload"].read().decode() or "{}")
            # nếu bc_attest trả body JSON
            if "body" in out:
                body2=json.loads(out["body"])
                txhash=body2.get("txHash")
            else:
                txhash=out.get("txHash")
            if txhash:
                # cập nhật vào TX
                ddb.update_item(Key={"transactionId": tx_id},
                    UpdateExpression="SET verified=:v, txHash=:h, verifiedAt=:ts",
                    ExpressionAttributeValues={":v":True, ":h":txhash, ":ts":now})
        except Exception as ex:
            # vẫn coi APPROVED nhưng không có hash (log để xử lý sau)
            print("attest_failed:", repr(ex))

    return _resp(200, {"ok":True,"status":decision,"txHash":txhash})
