import axios from 'axios';
import { RESOURCE_SERVER_URL } from "../../config"
export const GET_ALL_CADENCES = "GET_ALL_CADENCES";
export const SET_ALL_CADENCES = "SET_ALL_CADENCES";

export const getCadences = (limit = 25, offset = 0, userId) => {

    const headers = {
        authorization: "Bearer " + localStorage.getItem("token")
    }

    const requestData = {
        "page[limit]": limit,
        "page[offset]": offset,
        "filter[user][id]": userId,
        "sort[name]": "asc"
    };

    return axios({
        url: RESOURCE_SERVER_URL + "cadences",
        headers: headers,
        params: requestData
    });
}

export const getAllCadences = (userId) => dispatch => {

    const limit = 20;
    let offset = 0;
    let cadencesData = {};

    dispatch({
        type: GET_ALL_CADENCES,
        payLoad: {
            loading: true
        }
    })

    getCadences(limit, offset, userId)
        .then(response => {

            cadencesData = { data: [...response.data.data] }

            const getCadencesAboveLimit = async () => {
                while (response.data.paging.totalCount > (limit * (offset + 1))) {

                    ++offset
                    let error = false;
                    await getCadences(limit, offset, userId)
                        .then(response => {

                            cadencesData = { data: [...cadencesData.data, ...response.data.data] };
                        }).catch(error => {

                            dispatch({
                                type: GET_ALL_CADENCES,
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

            getCadencesAboveLimit().then(() => {
                dispatch({
                    type: SET_ALL_CADENCES,
                    payLoad: {
                        ...cadencesData,
                        fetchedAll: true,
                        loading: false
                    }
                })
            });
        });
}