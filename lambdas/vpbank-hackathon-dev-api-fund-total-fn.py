import os, json, boto3
TABLE=os.environ["DDB_TABLE"]; ddb=boto3.resource("dynamodb").Table(TABLE)
def resp(c,o): return {"statusCode":c,"headers":{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"},"body":json.dumps(o)}
def lambda_handler(e,_):
    fund_id = (e.get("pathParameters") or {}).get("fundId")
    agg_pk = f"AGG#FUND#{fund_id}"
    r = ddb.get_item(Key={"transactionId": agg_pk})
    it = r.get("Item") or {"totalVND":0}
    return resp(200, {"ok":True, "fundId":fund_id, "totalVND":it.get("totalVND",0), "lastUpdated":it.get("lastUpdated")})
