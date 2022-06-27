chrome.runtime.onMessage.addListener(
    function (request, _, sendResponse) {
        if (request.method == "getQueryResult") {
            var headers = {};
            if (request.contentType != undefined)
                Object.assign(headers, { "Content-type": request.contentType });
            if (request.auth != undefined)
                Object.assign(headers, { "Authorization": request.auth });

            fetch(request.url, {
                method: request.type,
                headers: headers,
                body: request.data,
                referrer: request.referrer
            })
                .then(function (response) {
                    if (response.status == 204)
                        return;
                    else
                        return response.text();
                }).then(function (response) {
                    if (response == undefined)
                        return;

                    if (response.error) {
                        sendResponse({
                            success: false,
                            error: {
                                status: response.error.code,
                                message: response.error.message
                            }
                        });
                    } else {
                        sendResponse({ success: true, result: response });
                    }
                });

            return true;
        }
    });