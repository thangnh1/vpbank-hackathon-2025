import os, json, boto3
from boto3.dynamodb.conditions import Attr
TABLE=os.environ["DDB_TABLE"]; ddb=boto3.resource("dynamodb").Table(TABLE)

def resp(c,o): return {"statusCode":c,"headers":{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"},"body":json.dumps(o)}

def lambda_handler(e,_):
    qs = e.get("queryStringParameters") or {}
    fund_id = qs.get("fundId","default")
    limit   = int(qs.get("limit","50"))
    cursor  = qs.get("cursor")  # LastEvaluatedKey ở dạng JSON string

    fe = Attr("type").eq("TX") & Attr("fundId").eq(fund_id)
    if qs.get("from"): fe = fe & Attr("timestamp").gte(qs["from"])
    if qs.get("to"):   fe = fe & Attr("timestamp").lte(qs["to"])

    kwargs = {"FilterExpression": fe, "Limit": max(1,min(limit,200))}
    if cursor: kwargs["ExclusiveStartKey"] = json.loads(cursor)

    r = ddb.scan(**kwargs)
    next_cursor = json.dumps(r["LastEvaluatedKey"]) if "LastEvaluatedKey" in r else None
    items = r.get("Items", [])
    items.sort(key=lambda x: x.get("timestamp",""), reverse=True)
    return resp(200, {"ok":True, "count":len(items), "items":items, "nextCursor":next_cursor})
