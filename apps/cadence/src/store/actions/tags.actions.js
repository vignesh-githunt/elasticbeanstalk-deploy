/**
 * @author @rkrishna-gembrill
 * @version V11.0
 */
import axios from 'axios';
import { RESOURCE_SERVER_URL } from "../../config"
export const GET_ALL_TAGS = "GET_ALL_TAGS";
export const SET_ALL_TAGS = "SET_ALL_TAGS";

export const getTags = (limit = 25, offset = 0, userId, sort) => {

    const headers = {
        authorization: "Bearer " + localStorage.getItem("token")
    }

    const requestData = {
        "page[limit]": limit,
        "page[offset]": offset,
        //"filter[user][id]": userId
    };

    if (sort === undefined || sort === null) {

        requestData["sort[tagValue]"] = "ASC";
    }

    return axios({
        url: RESOURCE_SERVER_URL + "prospects/tags",
        headers: headers,
        params: requestData
    });
}

export const getAllTags = (userId) => dispatch => {

    const limit = 25;
    let offset = 0;
    let tagsData = {};

    dispatch({
        type: GET_ALL_TAGS,
        payLoad: {
            loading: true
        }
    })

    getTags(limit, offset, userId)
        .then(response => {

            tagsData = { data: [...response.data.data] }

            const getTagsAboveLimit = async () => {
                while (response.data.paging.totalCount > (limit * (offset + 1))) {

                    ++offset
                    let error = false;
                    await getTags(limit, offset, userId)
                        .then(response => {

                            tagsData = { data: [...tagsData.data, ...response.data.data] };
                        }).catch(error => {

                            dispatch({
                                type: GET_ALL_TAGS,
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

            getTagsAboveLimit().then(() => {
                dispatch({
                    type: SET_ALL_TAGS,
                    payLoad: {
                        ...tagsData,
                        fetchedAll: true,
                        loading: false
                    }
                })
            });
        });
}