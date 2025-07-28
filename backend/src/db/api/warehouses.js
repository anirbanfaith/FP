
const db = require('../models');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class WarehousesDBApi {

    static async create(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const warehouses = await db.warehouses.create(
            {
                id: data.id || undefined,

        name: data.name
        ||
        null
            ,

        city: data.city
        ||
        null
            ,

        space_available: data.space_available
        ||
        null
            ,

        contact: data.contact
        ||
        null
            ,

            importHash: data.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
    },
        { transaction },
    );

        return warehouses;
    }

    static async bulkImport(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        // Prepare data - wrapping individual data transformations in a map() method
        const warehousesData = data.map((item, index) => ({
                id: item.id || undefined,

                name: item.name
            ||
            null
            ,

                city: item.city
            ||
            null
            ,

                space_available: item.space_available
            ||
            null
            ,

                contact: item.contact
            ||
            null
            ,

            importHash: item.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
            createdAt: new Date(Date.now() + index * 1000),
    }));

        // Bulk create items
        const warehouses = await db.warehouses.bulkCreate(warehousesData, { transaction });

        return warehouses;
    }

    static async update(id, data, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const warehouses = await db.warehouses.findByPk(id, {}, {transaction});

        const updatePayload = {};

        if (data.name !== undefined) updatePayload.name = data.name;

        if (data.city !== undefined) updatePayload.city = data.city;

        if (data.space_available !== undefined) updatePayload.space_available = data.space_available;

        if (data.contact !== undefined) updatePayload.contact = data.contact;

        updatePayload.updatedById = currentUser.id;

        await warehouses.update(updatePayload, {transaction});

        return warehouses;
    }

    static async deleteByIds(ids, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const warehouses = await db.warehouses.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
            transaction,
        });

        await db.sequelize.transaction(async (transaction) => {
            for (const record of warehouses) {
                await record.update(
                    {deletedBy: currentUser.id},
                    {transaction}
                );
            }
            for (const record of warehouses) {
                await record.destroy({transaction});
            }
        });

        return warehouses;
    }

    static async remove(id, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const warehouses = await db.warehouses.findByPk(id, options);

        await warehouses.update({
            deletedBy: currentUser.id
        }, {
            transaction,
        });

        await warehouses.destroy({
            transaction
        });

        return warehouses;
    }

    static async findBy(where, options) {
        const transaction = (options && options.transaction) || undefined;

        const warehouses = await db.warehouses.findOne(
            { where },
            { transaction },
        );

        if (!warehouses) {
            return warehouses;
        }

        const output = warehouses.get({plain: true});

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

                if (filter.name) {
                    where = {
                        ...where,
                        [Op.and]: Utils.ilike(
                            'warehouses',
                            'name',
                            filter.name,
                        ),
                    };
                }

                if (filter.city) {
                    where = {
                        ...where,
                        [Op.and]: Utils.ilike(
                            'warehouses',
                            'city',
                            filter.city,
                        ),
                    };
                }

                if (filter.contact) {
                    where = {
                        ...where,
                        [Op.and]: Utils.ilike(
                            'warehouses',
                            'contact',
                            filter.contact,
                        ),
                    };
                }

            if (filter.space_availableRange) {
                const [start, end] = filter.space_availableRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                    space_available: {
                    ...where.space_available,
                            [Op.gte]: start,
                    },
                };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                    space_available: {
                    ...where.space_available,
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
            const { rows, count } = await db.warehouses.findAndCountAll(queryOptions);

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
                        'warehouses',
                        'name',
                        query,
                    ),
                ],
            };
        }

        const records = await db.warehouses.findAll({
            attributes: [ 'id', 'name' ],
            where,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            orderBy: [['name', 'ASC']],
        });

        return records.map((record) => ({
            id: record.id,
            label: record.name,
        }));
    }

};

