# import os, json, jwt, hmac, hashlib, base64, time

# MODE=os.environ.get("MODE","JWT") 
# JWT_SECRET=os.environ.get("JWT_SECRET","")
# HMAC_SECRET=os.environ.get("HMAC_SECRET","")

# def lambda_handler(event, _):
#     token = _extract_token(event)
#     if not token: return _deny("no token")
#     try:
#         if MODE=="JWT":
#             claims = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
#             return _allow(claims.get("sub","user"), event["methodArn"])
#         else:  
#             ok = _verify_hmac(event, token)
#             return _allow("hmac-user", event["methodArn"]) if ok else _deny("bad sig")
#     except Exception as e:
#         return _deny(str(e))

# def _extract_token(e):
#     h = e.get("headers") or {}
#     auth = h.get("authorization") or h.get("Authorization") or ""
#     if auth.startswith("Bearer "): return auth.split(" ",1)[1]
#     return None

# def _verify_hmac(e, _unused):
#     h = e.get("headers") or {}
#     ts = h.get("x-ts",""); sig = h.get("x-sig","")
#     data = ts + (e.get("httpMethod","")) + (e.get("path",""))
#     mac = hmac.new(HMAC_SECRET.encode(), data.encode(), hashlib.sha256).hexdigest()
#     if abs(time.time() - int(ts or "0")) > 300: return False
#     return hmac.compare_digest(mac, sig)

# def _allow(principal, arn):
#     return {"principalId": principal, "policyDocument":{"Version":"2012-10-17","Statement":[{"Action":"execute-api:Invoke","Effect":"Allow","Resource":[arn]}]}}

# def _deny(reason):
#     return {"principalId":"anonymous","policyDocument":{"Version":"2012-10-17","Statement":[{"Action":"execute-api:Invoke","Effect":"Deny","Resource":["*"]}]}, "context":{"reason":reason}}
