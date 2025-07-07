import {
  SearchForm,
  type SearchField
} from '../../../shared/components/SearchForm'

interface SearchFormData extends Record<string, string> {
  customerNameKeyword: string
}

type SearchFormValue = string | string[]

interface ManagerReservationSearchFormProps {
  formData: SearchFormData
  onFormDataChange: (key: 'customerNameKeyword', value: SearchFormValue) => void
  onSearch: (keyword?: string) => void
  className?: string
}

export const ManagerReservationSearchForm = ({
  formData,
  onFormDataChange,
  onSearch,
  className = ''
}: ManagerReservationSearchFormProps) => {
  const fields: SearchField[] = [
    {
      type: 'select',
      name: 'searchType',
      options: [
        { value: 'customerName', label: '고객명' },
        { value: 'customerAddress', label: '고객 주소' }
      ]
    },
    {
      type: 'text',
      name: 'customerNameKeyword',
      placeholder: '검색어'
    }
  ]

  const handleSearch = (values: Record<string, string>) => {
    // 검색 타입에 따라 키워드 업데이트
    const keyword = values.customerNameKeyword || ''
    onFormDataChange('customerNameKeyword', keyword)
    // 최신 keyword 값을 직접 전달
    onSearch(keyword)
  }

  return (
    <SearchForm
      fields={fields}
      onSearch={handleSearch}
      initialValues={{
        searchType: 'customerName',
        customerNameKeyword: formData.customerNameKeyword
      }}
      showTitle={false}
      className={className}
    />
  )
}

export default ManagerReservationSearchForm
