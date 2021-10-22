// Models
import {
	addRecordsItems,
	createCategory,
	createRecord,
	deleteCategory,
	deleteRecord,
	restoreRecord,
	setCategories,
	setCategoryTypes,
	setChartRecords,
	setRecordsStatus,
	updateCategory,
	updateRecord,
} from '#models/finance'

// Utils
import { Http } from '#utils/Http'

// Types
import { AppThunk } from '#models/store'
import { IFinanceCategory, IFinanceCategoryType, IFinanceRecord } from '#interfaces/finance'

export const createCategoryTc =
	({
		name,
		typeId,
	}: {
		name: IFinanceCategory['name']
		typeId: IFinanceCategoryType['id']
	}): AppThunk =>
	async (dispatch) => {
		const category = await Http.post({
			payload: {
				name,
				typeId,
			},
			url: 'api/finance-category',
		})

		dispatch(createCategory(category))
	}

export const createRecordTc =
	({
		amount,
		categoryId,
		date,
	}: {
		amount: IFinanceRecord['amount']
		categoryId: IFinanceCategory['id']
		date: IFinanceRecord['date']
	}): AppThunk =>
	async (dispatch) => {
		const record = await Http.post({
			payload: {
				amount,
				categoryId,
				date,
			},
			url: 'api/finance-record',
		})

		dispatch(createRecord(record))
	}

export const deleteCategoryTc =
	({ categoryId }: { categoryId: IFinanceCategory['id'] }): AppThunk =>
	async (dispatch) => {
		const { id } = await Http.delete({
			url: 'api/finance-category/' + categoryId,
		})

		dispatch(deleteCategory(id))
	}

export const deleteRecordTc =
	({
		isTrashed,
		recordId,
	}: {
		isTrashed: IFinanceRecord['isTrashed']
		recordId: IFinanceRecord['id']
	}): AppThunk =>
	async (dispatch) => {
		let record

		if (isTrashed) {
			record = await Http.delete({
				url: 'api/finance-record/' + recordId,
			})
		} else {
			record = await Http.patch({
				payload: { isTrashed: true },
				url: 'api/finance-record/' + recordId,
			})
		}

		dispatch(deleteRecord({ permanently: isTrashed, record }))
	}

export const getCategories = (): AppThunk => async (dispatch, getState) => {
	if (getState().finance.categories.status !== 'idle') return
	const categories = await Http.get({ url: 'api/finance-category' })
	dispatch(setCategories(categories))
}

export const getCategoryTypes = (): AppThunk => async (dispatch, getState) => {
	if (getState().finance.categoryTypes.status !== 'idle') return
	const categoryTypes = await Http.get({ url: 'api/finance-category-type' })
	dispatch(setCategoryTypes(categoryTypes))
}

export const getChartRecordsTc = (): AppThunk => async (dispatch, getState) => {
	if (getState().finance.chartRecords.status !== 'idle') return
	const chartRecords = await Http.get({
		url: 'api/finance-record?isTrashed=false&orderingByDate=ASC&orderingById=ASC',
	})
	dispatch(setChartRecords(chartRecords))
}

export const getRecordsTc =
	({ isTrash }: { isTrash: boolean }): AppThunk =>
	async (dispatch, getState) => {
		const existingRecords = getState().finance.records[isTrash ? 'trashed' : 'notTrashed']

		if (['completed', 'loading'].includes(existingRecords.status)) return

		dispatch(setRecordsStatus({ isTrash, status: 'loading' }))

		const records = await Http.get({
			url: `api/finance-record?isTrashed=${isTrash}&orderingByDate=DESC&orderingById=DESC&skip=${existingRecords.items.length}`,
		})

		dispatch(addRecordsItems({ isTrash, items: records }))

		dispatch(
			setRecordsStatus({
				isTrash,
				status: records.length === 0 ? 'completed' : 'success',
			}),
		)
	}

export const restoreRecordTc =
	(recordId: IFinanceRecord['id']): AppThunk =>
	async (dispatch) => {
		const record = await Http.patch({
			payload: { isTrashed: false },
			url: 'api/finance-record/' + recordId,
		})

		dispatch(restoreRecord(record))
	}

export const updateCategoryTc =
	({
		categoryId,
		name,
		typeId,
	}: {
		categoryId: IFinanceCategory['id']
		name: IFinanceCategory['name']
		typeId: IFinanceCategoryType['id']
	}): AppThunk =>
	async (dispatch) => {
		const category = await Http.patch({
			payload: {
				name,
				typeId,
			},
			url: 'api/finance-category/' + categoryId,
		})

		dispatch(updateCategory(category))
	}

export const updateRecordTc =
	({
		amount,
		categoryId,
		date,
		id,
	}: {
		amount: IFinanceRecord['amount']
		categoryId: IFinanceCategory['id']
		date: IFinanceRecord['date']
		id: IFinanceRecord['id']
	}): AppThunk =>
	async (dispatch) => {
		const record = await Http.patch({
			payload: {
				amount,
				categoryId,
				date,
			},
			url: 'api/finance-record/' + id,
		})

		dispatch(updateRecord(record))
	}
