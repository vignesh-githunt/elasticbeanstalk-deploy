import axios from 'axios';
import { RESOURCE_SERVER_URL } from "../../config";
export const GET_ALL_USERS = "GET_ALL_USERS";
export const SET_ALL_USERS = "SET_ALL_USERS";

export const getUsers = (limit, offset = 0, userId) => {

    const headers = {
        authorization: "Bearer " + localStorage.getItem("token")
    }

    const requestData = {
        "page[limit]": limit,
        "page[offset]": offset,
        "filter[id]": userId,
        "sort[displayName]": "asc"
    };

    return axios({
        url: RESOURCE_SERVER_URL + "users",
        headers: headers,
        params: requestData
    });
}

export const getAllUsers = (userId) => dispatch => {

    const limit = 20;
    let offset = 0;
    let usersData = {};

    dispatch({
        type: GET_ALL_USERS,
        payLoad: {
            loading: true
        }
    })

    getUsers(limit, offset, userId)
        .then(response => {

            usersData = { data: [...response.data.data] }

            const getUsersAboveLimit = async () => {

                while (response.data.paging.totalCount > (limit * (offset + 1))) {

                    ++offset
                    let error = false;
                    await getUsers(limit, offset, userId)
                        .then(response => {

                            usersData = { data: [...usersData.data, ...response.data.data] };
                        }).catch(error => {

                            dispatch({
                                type: GET_ALL_USERS,
                                payLoad: {
                                    loading: false,
                                    error: true
                                }
                            })
                            error = true;
                        });

                    if (error)
                        break;
                }
            }

            getUsersAboveLimit().then(() => {
                dispatch({
                    type: SET_ALL_USERS,
                    payLoad: {
                        ...usersData,
                        fetchedAll: true,
                        loading: false
                    }
                })
            });
        });
}