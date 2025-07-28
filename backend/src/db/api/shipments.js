
const db = require('../models');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class ShipmentsDBApi {

    static async create(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const shipments = await db.shipments.create(
            {
                id: data.id || undefined,

        tracking_id: data.tracking_id
        ||
        null
            ,

        pickup_date: data.pickup_date
        ||
        null
            ,

        delivery_date: data.delivery_date
        ||
        null
            ,

        status: data.status
        ||
        null
            ,

            importHash: data.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
    },
        { transaction },
    );

        return shipments;
    }

    static async bulkImport(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        // Prepare data - wrapping individual data transformations in a map() method
        const shipmentsData = data.map((item, index) => ({
                id: item.id || undefined,

                tracking_id: item.tracking_id
            ||
            null
            ,

                pickup_date: item.pickup_date
            ||
            null
            ,

                delivery_date: item.delivery_date
            ||
            null
            ,

                status: item.status
            ||
            null
            ,

            importHash: item.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
            createdAt: new Date(Date.now() + index * 1000),
    }));

        // Bulk create items
        const shipments = await db.shipments.bulkCreate(shipmentsData, { transaction });

        return shipments;
    }

    static async update(id, data, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const shipments = await db.shipments.findByPk(id, {}, {transaction});

        const updatePayload = {};

        if (data.tracking_id !== undefined) updatePayload.tracking_id = data.tracking_id;

        if (data.pickup_date !== undefined) updatePayload.pickup_date = data.pickup_date;

        if (data.delivery_date !== undefined) updatePayload.delivery_date = data.delivery_date;

        if (data.status !== undefined) updatePayload.status = data.status;

        updatePayload.updatedById = currentUser.id;

        await shipments.update(updatePayload, {transaction});

        return shipments;
    }

    static async deleteByIds(ids, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const shipments = await db.shipments.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
            transaction,
        });

        await db.sequelize.transaction(async (transaction) => {
            for (const record of shipments) {
                await record.update(
                    {deletedBy: currentUser.id},
                    {transaction}
                );
            }
            for (const record of shipments) {
                await record.destroy({transaction});
            }
        });

        return shipments;
    }

    static async remove(id, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const shipments = await db.shipments.findByPk(id, options);

        await shipments.update({
            deletedBy: currentUser.id
        }, {
            transaction,
        });

        await shipments.destroy({
            transaction
        });

        return shipments;
    }

    static async findBy(where, options) {
        const transaction = (options && options.transaction) || undefined;

        const shipments = await db.shipments.findOne(
            { where },
            { transaction },
        );

        if (!shipments) {
            return shipments;
        }

        const output = shipments.get({plain: true});

        return output;
    }

    static async findAll(filter, options) {
        const limit = filter.limit || 0;
        let offset = 0;
        let where = {};
        const currentPage = +filter.page;

        const user = (options && options.currentUser) || null;

        offset = currentPage * limit;

        const orderBy = null;

        const transaction = (options && options.transaction) || undefined;

        let include = [];

        if (filter) {
            if (filter.id) {
                where = {
                    ...where,
                    ['id']: Utils.uuid(filter.id),
                };
            }

                if (filter.tracking_id) {
                    where = {
                        ...where,
                        [Op.and]: Utils.ilike(
                            'shipments',
                            'tracking_id',
                            filter.tracking_id,
                        ),
                    };
                }

            if (filter.pickup_dateRange) {
                const [start, end] = filter.pickup_dateRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                    pickup_date: {
                    ...where.pickup_date,
                            [Op.gte]: start,
                    },
                };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                    pickup_date: {
                    ...where.pickup_date,
                            [Op.lte]: end,
                    },
                };
                }
            }

            if (filter.delivery_dateRange) {
                const [start, end] = filter.delivery_dateRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                    delivery_date: {
                    ...where.delivery_date,
                            [Op.gte]: start,
                    },
                };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                    delivery_date: {
                    ...where.delivery_date,
                            [Op.lte]: end,
                    },
                };
                }
            }

            if (filter.active !== undefined) {
                where = {
                    ...where,
                    active: filter.active === true || filter.active === 'true'
                };
            }

            if (filter.status) {
                where = {
                    ...where,
                status: filter.status,
            };
            }

            if (filter.createdAtRange) {
                const [start, end] = filter.createdAtRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                        ['createdAt']: {
                            ...where.createdAt,
                            [Op.gte]: start,
                        },
                    };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                        ['createdAt']: {
                            ...where.createdAt,
                            [Op.lte]: end,
                        },
                    };
                }
            }
        }

        const queryOptions = {
            where,
            include,
            distinct: true,
            order: filter.field && filter.sort
                ? [[filter.field, filter.sort]]
                : [['createdAt', 'desc']],
            transaction: options?.transaction,
            logging: console.log
        };

        if (!options?.countOnly) {
            queryOptions.limit = limit ? Number(limit) : undefined;
            queryOptions.offset = offset ? Number(offset) : undefined;
        }

        try {
            const { rows, count } = await db.shipments.findAndCountAll(queryOptions);

            return {
                rows: options?.countOnly ? [] : rows,
                count: count
            };
        } catch (error) {
            console.error('Error executing query:', error);
            throw error;
        }
    }

    static async findAllAutocomplete(query, limit, offset) {
        let where = {};

        if (query) {
            where = {
                [Op.or]: [
                    { ['id']: Utils.uuid(query) },
                    Utils.ilike(
                        'shipments',
                        'tracking_id',
                        query,
                    ),
                ],
            };
        }

        const records = await db.shipments.findAll({
            attributes: [ 'id', 'tracking_id' ],
            where,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            orderBy: [['tracking_id', 'ASC']],
        });

        return records.map((record) => ({
            id: record.id,
            label: record.tracking_id,
        }));
    }

};

