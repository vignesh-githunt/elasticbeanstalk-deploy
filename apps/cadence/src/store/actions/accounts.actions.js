import axios from 'axios';
import { RESOURCE_SERVER_URL } from "../../config"
export const GET_ALL_ACCOUNTS = "GET_ALL_ACCOUNTS";
export const SET_ALL_ACCOUNTS = "SET_ALL_ACCOUNTS";

export const getAccounts = (limit = 25, offset = 0, userId) => {

    const headers = {
        authorization: "Bearer " + localStorage.getItem("token")
    }

    const requestData = {
        "page[limit]": limit,
        "page[offset]": offset,
        "filter[user][id]": userId
    };

    return axios({
        url: RESOURCE_SERVER_URL + "accounts",
        headers: headers,
        params: requestData
    });
}

export const getAllAccounts = (userId) => dispatch => {

    const limit = 20;
    let offset = 0;
    let accountsData = {};

    getAccounts(limit, offset, userId)
        .then(response => {

            accountsData = { data: [...response.data.data] }

            const getAccountsAboveLimit = async () => {
                while (response.data.paging.totalCount > (limit * (offset + 1))) {

                    ++offset

                    await getAccounts(limit, offset, userId)
                        .then(response => {

                            accountsData = { data: [...accountsData.data, ...response.data.data] };
                        }).catch(error => {

                            console.log(error);
                        });
                }
            }
            
            getAccountsAboveLimit().then(() => {
                dispatch({
                    type: SET_ALL_ACCOUNTS,
                    payLoad: {
                        ...accountsData,
                        fetchedAll: true
                    }
                })
            });
        });
}

