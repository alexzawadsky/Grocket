import { useRef, useState } from 'react'
import { Link, Outlet, Routes, useOutlet, Route } from 'react-router-dom'
import { Input, Spinner, Title, Button, Form } from '../../components/ui'
import { AvatarCrop } from '../../components'
import { MdPassword } from 'react-icons/md'
import {
    BsPersonBoundingBox,
    BsPersonLinesFill,
    BsFillPersonXFill,
} from 'react-icons/bs'
import useInput from '../../hooks/useInput'
import {
    useDeleteProfile,
    useProfile,
    useUpdatePassword,
    useUpdateProfile,
} from '../../api/api'
import BackToProfile from './BackToProfile'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'

export const PasswordReset = () => {
    const { t } = useTranslation()
    const oldPwd = useInput('', { isEmpty: true })
    const newPwd = useInput('', { isEmpty: true })

    const updateProfileMutation = useUpdatePassword()

    return (
        <Form
            onSubmit={() => {
                updateProfileMutation.mutate({
                    new_password: newPwd.value,
                    current_password: oldPwd.value,
                })
            }}
            className="grid w-full gap-3 md:w-2/3 lg:w-1/2"
            errors={updateProfileMutation.error?.response.data}
        >
            <Input
                name="current_password"
                title={t('old_pass')}
                type="password"
                instance={oldPwd}
                must={true}
                hasError={
                    updateProfileMutation.error?.response.data[
                        'current_password'
                    ]
                }
            />
            <Input
                name="new_password"
                title={t('new_pass')}
                type="password"
                instance={newPwd}
                must={true}
                hasError={
                    updateProfileMutation.error?.response.data['new_password']
                }
            />
            <Button
                disabled={!oldPwd.allValid || !newPwd.allValid}
                style="fill"
                width="fit"
                color="accent-orange"
                height={10}
                px={5}
            >
                {updateProfileMutation.isLoading ? (
                    <Spinner />
                ) : (
                    t('change_pass')
                )}
            </Button>
        </Form>
    )
}

export const UpdateProfile = () => {
    const { t } = useTranslation()
    const { data } = useProfile('me')
    const name = useInput(data?.first_name, { isEmpty: true })
    const lastName = useInput(data?.last_name, { isEmpty: true })
    const email = useInput(data?.email, { isEmpty: true })
    const phone = useInput(data?.phone, { isEmpty: true })

    const updateProfileMutation = useUpdateProfile()

    const formData = {
        first_name: name.value,
        last_name: lastName.value,
        email: email.value,
        phone: phone.value,
    }

    const changedFields = data
        ? Object.entries(formData).filter(([key, value]) => value !== data[key])
        : {}

    return (
        <div className="grid w-full gap-3 md:w-2/3 lg:w-1/2">
            <Form
                className="grid gap-3 md:grid-cols-2"
                onSubmit={() => {
                    updateProfileMutation.mutate(
                        Object.fromEntries(changedFields)
                    )
                }}
                errors={updateProfileMutation?.error?.response.data}
            >
                <Input
                    name="first_name"
                    title={t('first_name')}
                    instance={name}
                    hasError={
                        updateProfileMutation.error?.response.data['first_name']
                    }
                />
                <Input
                    name="last_name"
                    title={t('last_name')}
                    instance={lastName}
                    hasError={
                        updateProfileMutation.error?.response.data['last_name']
                    }
                />
                <Input
                    name="phone"
                    title={t('phone')}
                    instance={phone}
                    hasError={
                        updateProfileMutation.error?.response.data['phone']
                    }
                />
                <Input
                    name="email"
                    className="col-span-full"
                    title={t('email')}
                    instance={email}
                    hasError={
                        updateProfileMutation.error?.response.data['email']
                    }
                />
                <Button
                    type="submit"
                    style="fill"
                    color="accent-orange"
                    height={10}
                    width="fit"
                    px={5}
                    className="col-span-full"
                    disabled={
                        changedFields.length === 0 ||
                        updateProfileMutation.isLoading
                    }
                >
                    {updateProfileMutation.isLoading ? (
                        <Spinner />
                    ) : (
                        t('update')
                    )}
                </Button>
            </Form>
        </div>
    )
}

export const DeleteProfile = () => {
    const { t } = useTranslation()
    const inputRef = useRef()
    const [agreed, setAgreed] = useState(false)
    const pwd = useInput('', { isEmpty: true })
    const deleteProfileMutation = useDeleteProfile()

    return (
        <>
            <h2 className="text-lg text-accent-red">{t('delete_heading')}</h2>
            <Form
                className="grid w-full gap-3 md:w-2/3 lg:w-1/2"
                errors={deleteProfileMutation.error?.response?.data}
                onSubmit={() =>
                    deleteProfileMutation.mutate({
                        data: {
                            current_password: pwd.value,
                        },
                    })
                }
            >
                <Input
                    title={t('password')}
                    instance={pwd}
                    type="password"
                    must={true}
                    name="current_password"
                    hasError={
                        deleteProfileMutation.error?.response?.data[
                            'current_password'
                        ]
                    }
                />
                <div>
                    <input
                        onChange={(e) => setAgreed(e.target.checked)}
                        ref={inputRef}
                        type="checkbox"
                        className="accent-accent-orange dark:bg-zinc-600"
                        id="check"
                    />
                    <label className="pl-2" htmlFor="check">
                        {t('delete_confirm')}
                    </label>
                </div>
                <Button
                    type="submit"
                    style="outline"
                    color="accent-red"
                    height={10}
                    width="fit"
                    px={5}
                    disabled={
                        !agreed || !pwd.allValid || pwd.value.length === 0
                    }
                >
                    {t('delete')}
                </Button>
            </Form>
        </>
    )
}

const ProfileSettings = () => {
    const { t } = useTranslation()
    const outlet = useOutlet()

    const settingsOptions = [
        {
            icon: <MdPassword />,
            name: t('change_pass'),
            url: 'password',
        },
        {
            icon: <BsPersonBoundingBox />,
            name: t('change_avatar'),
            url: 'avatar',
        },
        {
            icon: <BsPersonLinesFill />,
            name: t('change_profile_info'),
            url: 'info',
        },
        {
            icon: <BsFillPersonXFill />,
            name: t('delete_profile'),
            url: 'delete',
            red: true,
        },
    ]

    if (outlet) return <Outlet />

    return (
        <div className="grid w-full gap-3">
            <BackToProfile />
            <ul
                className="flex max-w-fit flex-wrap gap-1 rounded-xl border p-1 shadow-sm dark:border-2 dark:border-zinc-600"
                aria-label="filters list"
                role="filter options"
            >
                {settingsOptions.map((el, key) => (
                    <li key={key}>
                        <Link
                            className={cn(
                                'md:text-md flex h-8 cursor-pointer items-center justify-center gap-2 rounded-lg p-2 text-sm font-bold transition-all hover:bg-slate-100 dark:hover:bg-zinc-700',
                                window.location.pathname ===
                                    `/users/me/settings/${el.url}` &&
                                    '!bg-slate-200 dark:!bg-zinc-600',
                                el.red && 'text-accent-red'
                            )}
                            to={`/users/me/settings/${el.url}`}
                        >
                            {el.icon} {el.name}
                        </Link>
                    </li>
                ))}
            </ul>
            <Routes>
                <Route path="password" element={<PasswordReset />} />
                <Route path="avatar" element={<AvatarCrop />} />
                <Route path="info" element={<UpdateProfile />} />
                <Route path="delete" element={<DeleteProfile />} />
            </Routes>
        </div>
    )
}

export default ProfileSettings
