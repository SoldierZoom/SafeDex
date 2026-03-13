export async function getData(url) {
    return request(url, { method: 'GET' })
        .then(handleResponse)
        .then(response => response.json());
}

export async function putData(url, data) {
    return request(url, {
        method: 'PUT',
        body: JSON.stringify(data)
    }).then(handleResponse);
}

export async function postData(url, data) {
    return request(url, {
        method: 'POST',
        body: JSON.stringify(data)
    }).then(handleResponse);
}

export async function deleteData(url) {
    return request(url, {
        method: 'DELETE'
    }).then(handleResponse);
}

export function buildApiUrl(path, params) {
    let url = `${process.env.REACT_APP_SPRING_URL}/api/${path}`;

    if (params) {
        url += '?' + createQueryString(params);
    }

    return url;
}

export function createQueryString(params) {
    const query = new URLSearchParams();
    for (const key in params) {
        if (Array.isArray(params[key])) {
            params[key].forEach(value => query.append(key, value));
        } else {
            query.append(key, params[key]);
        }
    }
    return query.toString();
}

async function request(url, options) {
    const fetchOptions = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
        }
    };

    return fetch(url, fetchOptions);
}

function handleResponse(response) {
    if (response.ok) {
        return response;
    } else {
        return response.json()
            .then(data => {
                let error = new Error(data.message || 'An error occurred');
                error.status = data.statusCode || response.status;
                throw error;
            })
            .catch(error => {
                throw error;
            });
    }
}
