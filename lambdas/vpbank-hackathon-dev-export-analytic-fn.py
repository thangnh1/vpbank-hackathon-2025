import os, json, boto3, csv, io, datetime
from boto3.dynamodb.conditions import Attr
s3=boto3.client("s3"); ddb=boto3.resource("dynamodb").Table(os.environ["DDB_TABLE"])
BUCKET=os.environ["EVIDENCE_BUCKET"]

def lambda_handler(event,_):
    resp = ddb.scan(FilterExpression=Attr("type").eq("TX"))
    rows = resp.get("Items", [])
    out = io.StringIO(); w = csv.writer(out)
    w.writerow(["transactionId","fundId","amount","currency","timestamp","fromAccount","toAccount"])
    for it in rows:
        w.writerow([it.get("transactionId"), it.get("fundId","default"), it.get("amount",0), it.get("currency","VND"),
                    it.get("timestamp",""), it.get("fromAccount",""), it.get("toAccount","")])
    key = f"exports/tx_{datetime.datetime.utcnow().strftime('%Y%m%dT%H%M%SZ')}.csv"
    s3.put_object(Bucket=BUCKET, Key=key, Body=out.getvalue().encode("utf-8"), ContentType="text/csv")
    return {"ok":True,"s3":"s3://%s/%s"%(BUCKET,key)}
