
const db = require('../models');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class Support_ticketsDBApi {

    static async create(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const support_tickets = await db.support_tickets.create(
            {
                id: data.id || undefined,

        issue_type: data.issue_type
        ||
        null
            ,

        description: data.description
        ||
        null
            ,

        reported_at: data.reported_at
        ||
        null
            ,

            importHash: data.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
    },
        { transaction },
    );

        return support_tickets;
    }

    static async bulkImport(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        // Prepare data - wrapping individual data transformations in a map() method
        const support_ticketsData = data.map((item, index) => ({
                id: item.id || undefined,

                issue_type: item.issue_type
            ||
            null
            ,

                description: item.description
            ||
            null
            ,

                reported_at: item.reported_at
            ||
            null
            ,

            importHash: item.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
            createdAt: new Date(Date.now() + index * 1000),
    }));

        // Bulk create items
        const support_tickets = await db.support_tickets.bulkCreate(support_ticketsData, { transaction });

        return support_tickets;
    }

    static async update(id, data, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const support_tickets = await db.support_tickets.findByPk(id, {}, {transaction});

        const updatePayload = {};

        if (data.issue_type !== undefined) updatePayload.issue_type = data.issue_type;

        if (data.description !== undefined) updatePayload.description = data.description;

        if (data.reported_at !== undefined) updatePayload.reported_at = data.reported_at;

        updatePayload.updatedById = currentUser.id;

        await support_tickets.update(updatePayload, {transaction});

        return support_tickets;
    }

    static async deleteByIds(ids, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const support_tickets = await db.support_tickets.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
            transaction,
        });

        await db.sequelize.transaction(async (transaction) => {
            for (const record of support_tickets) {
                await record.update(
                    {deletedBy: currentUser.id},
                    {transaction}
                );
            }
            for (const record of support_tickets) {
                await record.destroy({transaction});
            }
        });

        return support_tickets;
    }

    static async remove(id, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const support_tickets = await db.support_tickets.findByPk(id, options);

        await support_tickets.update({
            deletedBy: currentUser.id
        }, {
            transaction,
        });

        await support_tickets.destroy({
            transaction
        });

        return support_tickets;
    }

    static async findBy(where, options) {
        const transaction = (options && options.transaction) || undefined;

        const support_tickets = await db.support_tickets.findOne(
            { where },
            { transaction },
        );

        if (!support_tickets) {
            return support_tickets;
        }

        const output = support_tickets.get({plain: true});

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

                if (filter.issue_type) {
                    where = {
                        ...where,
                        [Op.and]: Utils.ilike(
                            'support_tickets',
                            'issue_type',
                            filter.issue_type,
                        ),
                    };
                }

                if (filter.description) {
                    where = {
                        ...where,
                        [Op.and]: Utils.ilike(
                            'support_tickets',
                            'description',
                            filter.description,
                        ),
                    };
                }

            if (filter.reported_atRange) {
                const [start, end] = filter.reported_atRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                    reported_at: {
                    ...where.reported_at,
                            [Op.gte]: start,
                    },
                };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                    reported_at: {
                    ...where.reported_at,
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
            const { rows, count } = await db.support_tickets.findAndCountAll(queryOptions);

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
                        'support_tickets',
                        'issue_type',
                        query,
                    ),
                ],
            };
        }

        const records = await db.support_tickets.findAll({
            attributes: [ 'id', 'issue_type' ],
            where,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            orderBy: [['issue_type', 'ASC']],
        });

        return records.map((record) => ({
            id: record.id,
            label: record.issue_type,
        }));
    }

};

