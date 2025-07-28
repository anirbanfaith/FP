import dayjs from 'dayjs';
import _ from 'lodash';

export default {
    filesFormatter(arr) {
        if (!arr || !arr.length) return [];
        return arr.map((item) => item);
    },
    imageFormatter(arr) {
        if (!arr || !arr.length) return []
        return arr.map(item => ({
            publicUrl: item.publicUrl || ''
        }))
    },
    oneImageFormatter(arr) {
        if (!arr || !arr.length) return ''
        return arr[0].publicUrl || ''
    },
    dateFormatter(date) {
        if (!date) return ''
        return dayjs(date).format('YYYY-MM-DD')
    },
    dateTimeFormatter(date) {
        if (!date) return ''
        return dayjs(date).format('YYYY-MM-DD HH:mm')
    },
    booleanFormatter(val) {
        return val ? 'Yes' : 'No'
    },
    dataGridEditFormatter(obj) {
        return _.transform(obj, (result, value, key) => {
            if (_.isArray(value)) {
                result[key] = _.map(value, 'id');
            } else if (_.isObject(value)) {
                result[key] = value.id;
            } else {
                result[key] = value;
            }
        });
    },

        couriersManyListFormatter(val) {
            if (!val || !val.length) return []
            return val.map((item) => item.name)
        },
        couriersOneListFormatter(val) {
            if (!val) return ''
            return val.name
        },
        couriersManyListFormatterEdit(val) {
            if (!val || !val.length) return []
            return val.map((item) => {
              return {id: item.id, label: item.name}
            });
        },
        couriersOneListFormatterEdit(val) {
            if (!val) return ''
            return {label: val.name, id: val.id}
        },

        sellersManyListFormatter(val) {
            if (!val || !val.length) return []
            return val.map((item) => item.name)
        },
        sellersOneListFormatter(val) {
            if (!val) return ''
            return val.name
        },
        sellersManyListFormatterEdit(val) {
            if (!val || !val.length) return []
            return val.map((item) => {
              return {id: item.id, label: item.name}
            });
        },
        sellersOneListFormatterEdit(val) {
            if (!val) return ''
            return {label: val.name, id: val.id}
        },

        shipmentsManyListFormatter(val) {
            if (!val || !val.length) return []
            return val.map((item) => item.tracking_id)
        },
        shipmentsOneListFormatter(val) {
            if (!val) return ''
            return val.tracking_id
        },
        shipmentsManyListFormatterEdit(val) {
            if (!val || !val.length) return []
            return val.map((item) => {
              return {id: item.id, label: item.tracking_id}
            });
        },
        shipmentsOneListFormatterEdit(val) {
            if (!val) return ''
            return {label: val.tracking_id, id: val.id}
        },

}
