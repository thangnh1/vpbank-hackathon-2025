import os, json, boto3
sns=boto3.client("sns"); TOPIC=os.environ["SNS_TOPIC_ARN"]

def lambda_handler(event,_):
    sent=0
    for r in event.get("Records", []):
        if r["eventName"] not in ("INSERT","MODIFY"): continue
        new = _unmarshal(r["dynamodb"]["NewImage"])
        old = _unmarshal(r["dynamodb"].get("OldImage", {}))
        if new.get("type")=="VERIF" and new.get("status")=="PENDING_REVIEW" and old.get("status")!="PENDING_REVIEW":
            msg = {"txId": new["transactionId"].split("#",1)[1], "status":"PENDING_REVIEW", "docs": new.get("docs", [])}
            if TOPIC:
                sns.publish(TopicArn=TOPIC, Message=json.dumps(msg), Subject="[Review] Verification is ready")
            print("Notify:", msg); sent+=1
    return {"ok":True,"sent":sent}

def _unmarshal(m):
    if not m: return {}
    out={}
    for k,v in m.items():
        if "S" in v: out[k]=v["S"]
        elif "N" in v: out[k]=float(v["N"])
        elif "M" in v: out[k]=_unmarshal(v["M"])
        elif "L" in v: out[k]=[_unmarshal(i) if "M" in i else (list(i.values())[0]) for i in v["L"]]
        elif "BOOL" in v: out[k]=v["BOOL"]
    return out
