/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/auth/login/route";
exports.ids = ["app/api/auth/login/route"];
exports.modules = {

/***/ "(rsc)/./app/api/auth/login/route.ts":
/*!*************************************!*\
  !*** ./app/api/auth/login/route.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! crypto */ \"crypto\");\n/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_1__);\n\n\nasync function POST(req) {\n    try {\n        const body = await req.json().catch(()=>({}));\n        const { email, displayName, role, avatarUrl } = body || {};\n        const finalRole = role || \"DONOR\";\n        // mock validate: chỉ cần có email hoặc chọn 1 role demo\n        const uid = `u_${(0,crypto__WEBPACK_IMPORTED_MODULE_1__.randomUUID)()}`;\n        const session = {\n            userId: uid,\n            email: email || `${finalRole.toLowerCase()}@demo.local`,\n            displayName: displayName || (finalRole === \"DONOR\" ? \"Nhà hảo tâm\" : finalRole === \"ADMIN\" ? \"Quản trị viên\" : finalRole === \"AUDITOR\" ? \"Kiểm toán viên\" : \"Khách\"),\n            role: finalRole,\n            avatarUrl: avatarUrl || \"\",\n            issuedAt: Date.now()\n        };\n        const res = next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            ok: true,\n            user: session\n        });\n        // Lưu session vào cookie httpOnly\n        res.cookies.set(\"session\", JSON.stringify(session), {\n            path: \"/\",\n            httpOnly: true,\n            sameSite: \"lax\",\n            secure: false,\n            maxAge: 60 * 60 * 24 * 30\n        });\n        return res;\n    } catch (e) {\n        console.error(e);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Đăng nhập thất bại\"\n        }, {\n            status: 400\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2F1dGgvbG9naW4vcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUE0RDtBQUN6QjtBQUk1QixlQUFlRSxLQUFLQyxHQUFnQjtJQUN6QyxJQUFJO1FBQ0YsTUFBTUMsT0FBTyxNQUFNRCxJQUFJRSxJQUFJLEdBQUdDLEtBQUssQ0FBQyxJQUFPLEVBQUM7UUFDNUMsTUFBTSxFQUNKQyxLQUFLLEVBQ0xDLFdBQVcsRUFDWEMsSUFBSSxFQUNKQyxTQUFTLEVBQ1YsR0FBOEVOLFFBQVEsQ0FBQztRQUV4RixNQUFNTyxZQUFrQixRQUFrQjtRQUUxQyx3REFBd0Q7UUFDeEQsTUFBTUMsTUFBTSxDQUFDLEVBQUUsRUFBRVgsa0RBQVVBLElBQUk7UUFDL0IsTUFBTVksVUFBVTtZQUNkQyxRQUFRRjtZQUNSTCxPQUFPQSxTQUFTLEdBQUdJLFVBQVVJLFdBQVcsR0FBRyxXQUFXLENBQUM7WUFDdkRQLGFBQWFBLGVBQWdCRyxDQUFBQSxjQUFjLFVBQVUsZ0JBQWdCQSxjQUFjLFVBQVUsa0JBQWtCQSxjQUFjLFlBQVksbUJBQW1CLE9BQU07WUFDbEtGLE1BQU1FO1lBQ05ELFdBQVdBLGFBQWE7WUFDeEJNLFVBQVVDLEtBQUtDLEdBQUc7UUFDcEI7UUFFQSxNQUFNQyxNQUFNbkIscURBQVlBLENBQUNLLElBQUksQ0FBQztZQUFFZSxJQUFJO1lBQU1DLE1BQU1SO1FBQVE7UUFFeEQsa0NBQWtDO1FBQ2xDTSxJQUFJRyxPQUFPLENBQUNDLEdBQUcsQ0FBQyxXQUFXQyxLQUFLQyxTQUFTLENBQUNaLFVBQVU7WUFDbERhLE1BQU07WUFDTkMsVUFBVTtZQUNWQyxVQUFVO1lBQ1ZDLFFBQVE7WUFDUkMsUUFBUSxLQUFLLEtBQUssS0FBSztRQUN6QjtRQUVBLE9BQU9YO0lBQ1QsRUFBRSxPQUFPWSxHQUFHO1FBQ1ZDLFFBQVFDLEtBQUssQ0FBQ0Y7UUFDZCxPQUFPL0IscURBQVlBLENBQUNLLElBQUksQ0FBQztZQUFFNEIsT0FBTztRQUFxQixHQUFHO1lBQUVDLFFBQVE7UUFBSTtJQUMxRTtBQUNGIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXGxpbmhuXFxNWV9QUk9KRUNUc1xcdnBiYW5rLWhhY2thdGhvbi0yMDI1XFxhcHBzXFxmZVxcYXBwXFxhcGlcXGF1dGhcXGxvZ2luXFxyb3V0ZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0UmVzcG9uc2UsIHR5cGUgTmV4dFJlcXVlc3QgfSBmcm9tIFwibmV4dC9zZXJ2ZXJcIlxuaW1wb3J0IHsgcmFuZG9tVVVJRCB9IGZyb20gXCJjcnlwdG9cIlxuXG50eXBlIFJvbGUgPSBcIkdVRVNUXCIgfCBcIkRPTk9SXCIgfCBcIkFETUlOXCIgfCBcIkFVRElUT1JcIlxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUE9TVChyZXE6IE5leHRSZXF1ZXN0KSB7XG4gIHRyeSB7XG4gICAgY29uc3QgYm9keSA9IGF3YWl0IHJlcS5qc29uKCkuY2F0Y2goKCkgPT4gKHt9IGFzIGFueSkpXG4gICAgY29uc3Qge1xuICAgICAgZW1haWwsXG4gICAgICBkaXNwbGF5TmFtZSxcbiAgICAgIHJvbGUsXG4gICAgICBhdmF0YXJVcmwsXG4gICAgfTogeyBlbWFpbD86IHN0cmluZzsgZGlzcGxheU5hbWU/OiBzdHJpbmc7IHJvbGU/OiBSb2xlOyBhdmF0YXJVcmw/OiBzdHJpbmcgfSA9IGJvZHkgfHwge31cblxuICAgIGNvbnN0IGZpbmFsUm9sZTogUm9sZSA9IChyb2xlIGFzIFJvbGUpIHx8IFwiRE9OT1JcIlxuXG4gICAgLy8gbW9jayB2YWxpZGF0ZTogY2jhu4kgY+G6p24gY8OzIGVtYWlsIGhv4bq3YyBjaOG7jW4gMSByb2xlIGRlbW9cbiAgICBjb25zdCB1aWQgPSBgdV8ke3JhbmRvbVVVSUQoKX1gXG4gICAgY29uc3Qgc2Vzc2lvbiA9IHtcbiAgICAgIHVzZXJJZDogdWlkLFxuICAgICAgZW1haWw6IGVtYWlsIHx8IGAke2ZpbmFsUm9sZS50b0xvd2VyQ2FzZSgpfUBkZW1vLmxvY2FsYCxcbiAgICAgIGRpc3BsYXlOYW1lOiBkaXNwbGF5TmFtZSB8fCAoZmluYWxSb2xlID09PSBcIkRPTk9SXCIgPyBcIk5ow6AgaOG6o28gdMOibVwiIDogZmluYWxSb2xlID09PSBcIkFETUlOXCIgPyBcIlF14bqjbiB0cuG7iyB2acOqblwiIDogZmluYWxSb2xlID09PSBcIkFVRElUT1JcIiA/IFwiS2nhu4NtIHRvw6FuIHZpw6puXCIgOiBcIktow6FjaFwiKSxcbiAgICAgIHJvbGU6IGZpbmFsUm9sZSxcbiAgICAgIGF2YXRhclVybDogYXZhdGFyVXJsIHx8IFwiXCIsXG4gICAgICBpc3N1ZWRBdDogRGF0ZS5ub3coKSxcbiAgICB9XG5cbiAgICBjb25zdCByZXMgPSBOZXh0UmVzcG9uc2UuanNvbih7IG9rOiB0cnVlLCB1c2VyOiBzZXNzaW9uIH0pXG5cbiAgICAvLyBMxrB1IHNlc3Npb24gdsOgbyBjb29raWUgaHR0cE9ubHlcbiAgICByZXMuY29va2llcy5zZXQoXCJzZXNzaW9uXCIsIEpTT04uc3RyaW5naWZ5KHNlc3Npb24pLCB7XG4gICAgICBwYXRoOiBcIi9cIixcbiAgICAgIGh0dHBPbmx5OiB0cnVlLFxuICAgICAgc2FtZVNpdGU6IFwibGF4XCIsXG4gICAgICBzZWN1cmU6IGZhbHNlLFxuICAgICAgbWF4QWdlOiA2MCAqIDYwICogMjQgKiAzMCwgLy8gMzAgbmfDoHlcbiAgICB9KVxuXG4gICAgcmV0dXJuIHJlc1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5lcnJvcihlKVxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiBcIsSQxINuZyBuaOG6rXAgdGjhuqV0IGLhuqFpXCIgfSwgeyBzdGF0dXM6IDQwMCB9KVxuICB9XG59XG4iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwicmFuZG9tVVVJRCIsIlBPU1QiLCJyZXEiLCJib2R5IiwianNvbiIsImNhdGNoIiwiZW1haWwiLCJkaXNwbGF5TmFtZSIsInJvbGUiLCJhdmF0YXJVcmwiLCJmaW5hbFJvbGUiLCJ1aWQiLCJzZXNzaW9uIiwidXNlcklkIiwidG9Mb3dlckNhc2UiLCJpc3N1ZWRBdCIsIkRhdGUiLCJub3ciLCJyZXMiLCJvayIsInVzZXIiLCJjb29raWVzIiwic2V0IiwiSlNPTiIsInN0cmluZ2lmeSIsInBhdGgiLCJodHRwT25seSIsInNhbWVTaXRlIiwic2VjdXJlIiwibWF4QWdlIiwiZSIsImNvbnNvbGUiLCJlcnJvciIsInN0YXR1cyJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/auth/login/route.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2Flogin%2Froute&page=%2Fapi%2Fauth%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Flogin%2Froute.ts&appDir=C%3A%5CUsers%5Clinhn%5CMY_PROJECTs%5Cvpbank-hackathon-2025%5Capps%5Cfe%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Clinhn%5CMY_PROJECTs%5Cvpbank-hackathon-2025%5Capps%5Cfe&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2Flogin%2Froute&page=%2Fapi%2Fauth%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Flogin%2Froute.ts&appDir=C%3A%5CUsers%5Clinhn%5CMY_PROJECTs%5Cvpbank-hackathon-2025%5Capps%5Cfe%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Clinhn%5CMY_PROJECTs%5Cvpbank-hackathon-2025%5Capps%5Cfe&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_linhn_MY_PROJECTs_vpbank_hackathon_2025_apps_fe_app_api_auth_login_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/auth/login/route.ts */ \"(rsc)/./app/api/auth/login/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/auth/login/route\",\n        pathname: \"/api/auth/login\",\n        filename: \"route\",\n        bundlePath: \"app/api/auth/login/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\linhn\\\\MY_PROJECTs\\\\vpbank-hackathon-2025\\\\apps\\\\fe\\\\app\\\\api\\\\auth\\\\login\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_linhn_MY_PROJECTs_vpbank_hackathon_2025_apps_fe_app_api_auth_login_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZhdXRoJTJGbG9naW4lMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmF1dGglMkZsb2dpbiUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmF1dGglMkZsb2dpbiUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNsaW5obiU1Q01ZX1BST0pFQ1RzJTVDdnBiYW5rLWhhY2thdGhvbi0yMDI1JTVDYXBwcyU1Q2ZlJTVDYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj1DJTNBJTVDVXNlcnMlNUNsaW5obiU1Q01ZX1BST0pFQ1RzJTVDdnBiYW5rLWhhY2thdGhvbi0yMDI1JTVDYXBwcyU1Q2ZlJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNxQjtBQUMrQztBQUM1SDtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFzRDtBQUM5RDtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMwRjs7QUFFMUYiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiQzpcXFxcVXNlcnNcXFxcbGluaG5cXFxcTVlfUFJPSkVDVHNcXFxcdnBiYW5rLWhhY2thdGhvbi0yMDI1XFxcXGFwcHNcXFxcZmVcXFxcYXBwXFxcXGFwaVxcXFxhdXRoXFxcXGxvZ2luXFxcXHJvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9hdXRoL2xvZ2luL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvYXV0aC9sb2dpblwiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvYXV0aC9sb2dpbi9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIkM6XFxcXFVzZXJzXFxcXGxpbmhuXFxcXE1ZX1BST0pFQ1RzXFxcXHZwYmFuay1oYWNrYXRob24tMjAyNVxcXFxhcHBzXFxcXGZlXFxcXGFwcFxcXFxhcGlcXFxcYXV0aFxcXFxsb2dpblxcXFxyb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHdvcmtBc3luY1N0b3JhZ2UsXG4gICAgICAgIHdvcmtVbml0QXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2Flogin%2Froute&page=%2Fapi%2Fauth%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Flogin%2Froute.ts&appDir=C%3A%5CUsers%5Clinhn%5CMY_PROJECTs%5Cvpbank-hackathon-2025%5Capps%5Cfe%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Clinhn%5CMY_PROJECTs%5Cvpbank-hackathon-2025%5Capps%5Cfe&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2Flogin%2Froute&page=%2Fapi%2Fauth%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Flogin%2Froute.ts&appDir=C%3A%5CUsers%5Clinhn%5CMY_PROJECTs%5Cvpbank-hackathon-2025%5Capps%5Cfe%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Clinhn%5CMY_PROJECTs%5Cvpbank-hackathon-2025%5Capps%5Cfe&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();