import { useContext, useEffect, useMemo, useState } from "react"
import { useAllCategories } from "../../../api/api"
import { Spinner } from "../../../components"
import CategoriesListStateContext from "../../../contexts/CategoriesListStateContext"
import { IoIosArrowForward } from 'react-icons/io'
import { IoCarOutline } from 'react-icons/io5'
import CategoryLink from "./CategoryLink"
import { FaDog } from 'react-icons/fa'
// import { MdBusinessCenter } from 'react-icons/md'
import { BsPhone, BsGear, BsBrush, BsBriefcase } from 'react-icons/bs'
import { BiHomeAlt } from "react-icons/bi"
import { TbShirt, TbBuildingSkyscraper } from "react-icons/tb"
import { RiCustomerServiceLine } from 'react-icons/ri'
import { GrUserWorker } from 'react-icons/gr'

const icons = {
    26098: <FaDog />,
    26382: <BsBriefcase />,
    26195: <BsPhone />,
    26047: <BiHomeAlt />,
    26127: <TbShirt />,
    26113: <TbBuildingSkyscraper />,
    26486: <RiCustomerServiceLine />,
    30757: <BsGear />,
    25984: <IoCarOutline />,
    26400: <GrUserWorker />,
    26315: <BsBrush />
}

const filterChildCategories = (categories, parentId) => {
    return categories?.filter(el => el?.parent === parentId)
}

const FullCategoriesList = () => {

    const { open } = useContext(CategoriesListStateContext)
    const { data, error, isLoading } = useAllCategories()
    const [parentCategory, setParentCategory] = useState()
    const [secondaryList, setSecondaryList] = useState(
        useMemo(() => filterChildCategories(data, parentCategory?.id),
            [data, parentCategory?.id]
        )
    )
    const [expandedCatId, setExpandedCatId] = useState(null)

    useEffect(() => {
        setSecondaryList(filterChildCategories(data, parentCategory?.id))
    }, [parentCategory?.id])

    if (isLoading) return <Spinner />
    if (error) return error.message

    if (!open) return

    return (
        <div
            className="bg-white p-5 w-full border-2 border-accent-orange rounded-xl grid grid-cols-[3fr_10fr]  gap-7 h-[80vh]"
        >
            <div className="overflow-y-auto">
                {data.filter(el => el.parent === null).map((el, key) =>
                    <div
                        key={key}
                        className='hover:bg-slate-100 gap-2 rounded-lg p-3 pr-5 hover:pr-3 flex items-center justify-between transition-all font-bold'
                        onMouseEnter={() => {
                            setParentCategory(el)
                            setExpandedCatId(null)
                        }}
                    >
                        {icons[el.id]}
                        <p className="mr-auto">{el.title}</p>
                        <div>
                            <IoIosArrowForward />
                        </div>
                    </div>)}
            </div>
            {parentCategory && <div className="h-[80vh] max-h-[80vh]">
                <CategoryLink id={parentCategory?.id}>
                    <h2 className="font-bold text-3xl pb-5 items-center gap-2 hover:gap-3 transition-all hover w-fit hover:text-accent-orange">
                        {parentCategory?.title}
                    </h2>
                </CategoryLink>
                <div className="flex flex-wrap flex-col max-h-[68vh] gap-3">
                    {secondaryList && secondaryList.map((el, key) =>
                        <div
                            key={key}
                            className='max-w-[20%]'
                        >
                            <CategoryLink id={el?.id}>
                                <h3 className="font-bold gap-1 hover:gap-2 transition-all text-lg items-center pb-2 w-fit hover:text-accent-orange">{el?.title}</h3>
                            </CategoryLink>
                            <div className="grid gap-1">
                                {(!expandedCatId || expandedCatId === el?.id) &&
                                    <>
                                        {filterChildCategories(data, el?.id).slice(0, expandedCatId === el?.id ? filterChildCategories(data, el?.id).length : 5).map((c, key) =>
                                            <CategoryLink
                                                key={key}
                                                id={c?.id}
                                            >
                                                <p className='hover:text-accent-orange w-fit'>{c?.title}</p>
                                            </CategoryLink>)}
                                        {filterChildCategories(data, el?.id).length > 5 && expandedCatId !== el?.id &&
                                            <button
                                                onClick={() => setExpandedCatId(el?.id)}
                                                className='w-fit hover:text-accent-orange'
                                            >
                                                more...
                                            </button>}
                                        {expandedCatId === el?.id &&
                                            <button
                                                onClick={() => setExpandedCatId(null)}
                                                className='w-fit hover:text-accent-orange'
                                            >
                                                less
                                            </button>}
                                    </>}
                            </div>
                        </div>)}
                </div>
            </div>}
        </div>
    )
}

export default FullCategoriesList