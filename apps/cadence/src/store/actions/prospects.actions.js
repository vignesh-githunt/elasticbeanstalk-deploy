/**
 * @author @rkrishna-gembrill
 * @version V11.0
 */
import axios from 'axios';
import { RESOURCE_SERVER_URL } from "../../config"
export const CREATE_PROSPECT = "CREATE_PROSPECT";
export const GET_ALL_PROSPECTS = "GET_ALL_PROSPECTS";
export const SET_ALL_PROSPECTS="SET_ALL_PROSPECTS"

export const getProspects = (limit = 25, offset = 0, userId) => {

    const headers = {
        authorization: "Bearer " + localStorage.getItem("token")
    }

    const requestData = {
        "page[limit]": limit,
        "page[offset]": offset,
        "filter[user][id]": userId,
        "sort[name]":"asc"
    };

    return axios({
        url: RESOURCE_SERVER_URL + "prospects",
        headers: headers,
        params: requestData
    });
}

export const getAllProspects = (userId) => dispatch => {

    const limit = 20;
    let offset = 0;
    let prospectsData = {};

    getProspects(limit, offset, userId)
        .then(response => {

            prospectsData = { data: [...response.data.data] }

            const getProspectsAboveLimit = async () => {
                while (response.data.paging.totalCount > (limit * (offset + 1))) {

                    ++offset

                    await getProspects(limit, offset, userId)
                        .then(response => {

                            prospectsData = { data: [...prospectsData.data, ...response.data.data] };
                        }).catch(error => {

                            console.log(error);
                        });
                }
            }
            
            getProspectsAboveLimit().then(() => {
                dispatch({
                    type: SET_ALL_PROSPECTS,
                    payLoad: {
                        ...prospectsData,
                        fetchedAll: true
                    }
                })
            });
        });
}