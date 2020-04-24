export class JsonLoader {
    load(url) {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then(response => {
                    if (response.status !== 200) {
                        console.log('Looks like there was a problem. Status Code: ' + response.status);
                        reject()
                        return;
                    }

                    // .json() = async parser
                    response
                        .json()
                        .then(function (data) {
                            resolve(data)
                        });
                }
                )
                .catch(function (err) {
                    console.error('Fetch Error :-S', err);
                    reject()
                });
        })
    }
}