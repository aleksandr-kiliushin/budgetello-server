import { useState } from 'react'
import cx from 'classnames'

// Fetching
import { useGetFinanceCategoriesQuery } from '#models/fetching/get-finance-categories.query'
import { useCreateFinanceRecordMutation } from '#models/fetching/create-finance-record.mutation'
import { useUpdateFinanceRecordMutation } from '#models/fetching/update-finance-record.mutation'

// Components
import { Svg } from '#components/lib/svg'
import { Datalist } from '#components/lib/datalist'

// Styles
import s from './index.module.css'

// Types
import { IFinanceCategory, IFinanceRecord } from '#interfaces/finance'

export const InputRow = ({ closeInputRow, record }: IProps) => {
	const [amount, setAmount] = useState(record?.amount ?? '')
	const [category, setCategory] = useState<IFinanceCategory | null>(record?.category ?? null)
	const [date, setDate] = useState(record?.date ?? new Date().toISOString().split('T')[0])

	const { data: financeCategoriesData } = useGetFinanceCategoriesQuery()

	const [createFinanceRecord] = useCreateFinanceRecordMutation()

	const [updateFinanceRecord] = useUpdateFinanceRecordMutation()

	const onSubmit = () => {
		if (!amount || !category || !date) {
			alert('Please, complete all fields.')
			return
		}

		const recordData = {
			amount: +amount,
			date,
			categoryId: category.id,
		}

		if (record) {
			updateFinanceRecord({ variables: { ...recordData, id: record.id } })
		} else {
			createFinanceRecord({ variables: recordData })
		}

		closeInputRow()
	}

	if (!financeCategoriesData) return null

	const { financeCategories } = financeCategoriesData

	const cxRow = cx({
		[s.Row]: true,
		[s.AddNewRecordRow]: !record,
	})

	return (
		<div className={cxRow}>
			<div className={s.Cell}>
				<input onChange={(e) => setAmount(e.target.value)} type="number" value={amount} />
			</div>

			<div className={s.Cell}>
				<Datalist
					options={financeCategories}
					renderOption={(category) => (
						<div
							key={category.id}
							onClick={() => setCategory(category)}
							className={category.type.name === 'expense' ? s.ExpenseCategory : s.IncomeCategory}
						>
							{category.name}
						</div>
					)}
					selectedOptionText={category?.name}
				/>
			</div>

			<div className={s.Cell}>
				<input onChange={(e) => setDate(e.target.value)} type="date" value={date} />
			</div>

			<div className={s.Cell} onClick={onSubmit}>
				<Svg name="checkmark" />
			</div>

			<div className={s.Cell} onClick={() => closeInputRow()}>
				<Svg name="cross" />
			</div>
		</div>
	)
}

interface IProps {
	closeInputRow: () => void
	record: IFinanceRecord | null
}