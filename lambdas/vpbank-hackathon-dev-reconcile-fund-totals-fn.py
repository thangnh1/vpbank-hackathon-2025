import os, json, boto3
from boto3.dynamodb.conditions import Attr
TABLE=os.environ["DDB_TABLE"]; DRY=os.environ.get("DRY_RUN","true").lower()=="true"
ddb=boto3.resource("dynamodb").Table(TABLE)

def lambda_handler(event,_):
    fund = (event.get("fundId") if isinstance(event,dict) else None) or "default"
    resp = ddb.scan(FilterExpression=Attr("type").eq("TX") & Attr("fundId").eq(fund))
    total = sum(float(it.get("amount",0)) for it in resp.get("Items",[]))
    agg_pk=f"AGG#FUND#"+fund
    agg = ddb.get_item(Key={"transactionId": agg_pk}).get("Item", {"totalVND":0})
    diff = total - float(agg.get("totalVND",0))
    if not DRY and abs(diff)>0.000001:
        ddb.update_item(Key={"transactionId": agg_pk},
                        UpdateExpression="SET totalVND=:t, lastUpdated=:ts",
                        ExpressionAttributeValues={":t": total, ":ts": event.get("now","") or ""})
    return {"ok":True,"fundId":fund,"computed":total,"stored":agg.get("totalVND",0),"diff":diff,"updated": (not DRY and abs(diff)>0.000001)}
