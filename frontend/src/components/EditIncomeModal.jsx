import React, {useState, useEffect} from 'react';
import Select from 'react-select';
import {Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input} from '@material-tailwind/react';
import {updateIncome, getCompanies} from '../api/api';
import AddCompanyModal from './AddCompanyModal';

const EditIncomeModal = ({isOpen, onClose, income, onUpdateIncome}) => {
    const [formData, setFormData] = useState({
        from_company: {
            id: '',
            name: '',
            phone: '',
            inn: '',
        },
        contract_date: '',
        contract_number: '',
        invoice_date: '',
        invoice_number: '',
        unit_of_measure: '',
        total: 0,
        products: [],
    });

    const [companyOptions, setCompanyOptions] = useState([]);
    const [isAddCompanyModalOpen, setIsAddCompanyModalOpen] = useState(false);
    const [manualTotal, setManualTotal] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            const fetchCompanies = async () => {
                try {
                    const response = await getCompanies();
                    const options = response.data.map(company => ({
                        value: company.id,
                        label: company.name,
                        phone: company.phone,
                        inn: company.inn,
                    }));
                    setCompanyOptions(options);
                } catch (error) {
                    console.error('Error fetching companies:', error);
                }
            };

            fetchCompanies();

            if (income) {
                setFormData({
                    ...income,
                    from_company: {
                        id: income.from_company?.id || '',
                        name: income.from_company?.name || '',
                        phone: income.from_company?.phone || '',
                        inn: income.from_company?.inn || '',
                    },
                    products: income.products ? income.products.map(product => ({
                        ...product,
                        markings: product.markings ? product.markings.map(marking => ({marking})) : [],
                    })) : [],
                });
            }
        }
    }, [isOpen, income]);

    const handleCompanyChange = (selectedOption) => {
        const selectedCompany = companyOptions.find(company => company.value === selectedOption.value);
        setFormData((prevData) => ({
            ...prevData,
            from_company: {
                id: selectedOption.value,
                name: selectedCompany.label,
                phone: selectedCompany.phone,
                inn: selectedCompany.inn,
            },
        }));
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        if (name.startsWith('from_company.')) {
            const field = name.split('.')[1];
            setFormData((prevData) => ({
                ...prevData,
                from_company: {
                    ...prevData.from_company,
                    [field]: value,
                },
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleTotalChange = (e) => {
        const {value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            total: parseFloat(value),
        }));
        setManualTotal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataToSubmit = {
            ...formData,
            total: parseFloat(formData.total),
        };

        if (!dataToSubmit.from_company.name) {
            setError('Не выбрана компания.');
            return;
        }

        try {
            const response = await updateIncome(dataToSubmit.id, dataToSubmit);
            onUpdateIncome(response);
            onClose();
        } catch (error) {
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                if (errorData.non_field_errors) {
                    setError(errorData.non_field_errors[0]);
                } else {
                    setError('Произошла ошибка при обновлении дохода.');
                }
            } else {
                setError('Произошла ошибка при обновлении дохода.');
            }
            console.error('Error updating income:', error.response?.data || error.message);
        }
    };

    const handleOpenAddCompanyModal = (e) => {
        e.stopPropagation();
        setIsAddCompanyModalOpen(true);
    };

    const handleCloseAddCompanyModal = () => {
        setIsAddCompanyModalOpen(false);
    };

    const handleAddCompany = (newCompany) => {
        setCompanyOptions((prevOptions) => [
            ...prevOptions,
            {
                value: newCompany.id,
                label: newCompany.name,
                phone: newCompany.phone,
                inn: newCompany.inn,
            },
        ]);
        setFormData((prevData) => ({
            ...prevData,
            from_company: {
                id: newCompany.id,
                name: newCompany.name,
                phone: newCompany.phone,
                inn: newCompany.inn,
            },
        }));
        handleCloseAddCompanyModal();
    };

    return (
        <>
            <Dialog open={isOpen} onClose={onClose}>
                <DialogHeader className='flex justify-between'>
                    <p>Редактировать доход</p>
                    <svg onClick={onClose} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                         strokeWidth={1.5} stroke="currentColor" className="size-6 cursor-pointer">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"/>
                    </svg>
                </DialogHeader>
                <DialogBody className="flex-1 overflow-y-auto max-h-[calc(100vh-200px)]">
                    <form id='income-form' onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex items-center mb-4">
                            <div className="w-full">
                                <Select
                                    className='w-[50%]'
                                    options={companyOptions}
                                    onChange={handleCompanyChange}
                                    placeholder="Выберите компанию"
                                    value={companyOptions.find(option => option.value === formData.from_company.id) || null}
                                />
                            </div>
                            <Button
                                size='sm'
                                type="button"
                                onClick={handleOpenAddCompanyModal}
                                color="blue"
                                className="ml-2"
                            >
                                Добавить
                            </Button>
                        </div>
                        <div className="flex items-center mb-4 space-x-4">
                            <div className="w-full">
                                <Input
                                    disabled
                                    type="text"
                                    label="Телефон компании"
                                    name="from_company.phone"
                                    value={formData.from_company.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="w-full">
                                <Input
                                    disabled
                                    type="text"
                                    label="ИНН компании"
                                    name="from_company.inn"
                                    value={formData.from_company.inn}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center mb-4 space-x-4">
                            <div className="w-full">
                                <Input
                                    type="date"
                                    label="Дата контракта"
                                    name="contract_date"
                                    value={formData.contract_date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="w-full">
                                <Input
                                    type="text"
                                    label="Номер контракта"
                                    name="contract_number"
                                    value={formData.contract_number}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex items-center mb-4 space-x-4">
                            <div className="w-full">
                                <Input
                                    type="date"
                                    label="Дата счета"
                                    name="invoice_date"
                                    value={formData.invoice_date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="w-full">
                                <Input
                                    type="text"
                                    label="Номер счета"
                                    name="invoice_number"
                                    value={formData.invoice_number}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="w-full">
                            <Input
                                type="text"
                                label="Единица измерения"
                                name="unit_of_measure"
                                value={formData.unit_of_measure}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="w-full mt-4">
                            <Input
                                type="text"
                                label="Общая сумма"
                                name="total"
                                value={formData.total.toFixed(2)}
                                onChange={handleTotalChange}
                            />
                        </div>
                        {formData.products && formData.products.length > 0 && (
                            <div className="mt-4">
                                <h2 className="text-lg font-semibold mb-2">Продукты и Маркировки</h2>
                                {formData.products.map((product, index) => (
                                    <div key={index} className="mb-4 p-4 border rounded-lg">
                                        <div>
                                            <p><strong>Название продукта:</strong> {product.name}</p>
                                            <p><strong>KPI продукта:</strong> {product.kpi}</p>
                                            <p><strong>Цена продукта:</strong> {product.price}</p>
                                            <p><strong>Количество продукта:</strong> {product.quantity}</p>
                                        </div>
                                        {product.markings && product.markings.length > 0 && (
                                            <div className="mt-2">
                                                <strong>Маркировки:</strong>
                                                {product.markings.map((marking, markingIndex) => (
                                                    <div key={markingIndex} className="ml-4">
                                                        <p>Маркировка {markingIndex + 1}: {marking.marking}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </form>
                    {error && <div className="text-red-500 mt-2 text-center">{error}</div>}
                </DialogBody>
                <DialogFooter>
                    <Button
                        form="income-form"
                        type="submit"
                        color="green"
                    >
                        Сохранить
                    </Button>
                </DialogFooter>
            </Dialog>
            <AddCompanyModal
                isOpen={isAddCompanyModalOpen}
                onClose={handleCloseAddCompanyModal}
                onAddCompany={handleAddCompany}
            />
        </>
    );
};

export default EditIncomeModal;
