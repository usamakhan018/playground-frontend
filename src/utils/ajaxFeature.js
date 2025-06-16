import axiosClient from '../axios';

const ajaxFeature = {
    async get(url, params = {}) {
        try {
            const response = await axiosClient.get(url, { params });
            return response.data;
        } catch (error) {
            console.error('GET request failed:', error);
            throw error;
        }
    },

    async post(url, data = {}) {
        try {
            const response = await axiosClient.post(url, data);
            return response.data;
        } catch (error) {
            console.error('POST request failed:', error);
            throw error;
        }
    },

    async put(url, data = {}) {
        try {
            const response = await axiosClient.put(url, data);
            return response.data;
        } catch (error) {
            console.error('PUT request failed:', error);
            throw error;
        }
    },

    async delete(url, data = {}) {
        try {
            const response = await axiosClient.delete(url, { data });
            return response.data;
        } catch (error) {
            console.error('DELETE request failed:', error);
            throw error;
        }
    }
};

export default ajaxFeature; 