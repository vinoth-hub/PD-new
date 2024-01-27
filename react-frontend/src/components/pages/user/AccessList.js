import styled from '@emotion/styled';
import { Box, Checkbox, FormControlLabel, FormGroup, Switch } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { getWithQueryApiServices } from '../../../apis/api';
import { apiRoutes } from '../../../apis/apiPath';
import { ListBox } from '../../../styles/commonStyles';

const BoxContainer = styled(Box)(({ theme }) => ({
    padding: "1.2%",
    boxSizing: "border-box",
    display: "flex",
    // justifyContent: "space-between",
    overflowX: "scroll"
}));

const CompanyBox = styled(Box)(({ theme }) => ({
    height: "600px",
    width: "270px",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    boxSizing: "border-box",
    // overflowY: "scroll"
}));

const CompanyTitle = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    width: "100%"
}));

const HeaderBox = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: "#bdbdbd",
}));



export const AccessList = ({ userDetails, setUserDetails, addNewUser, setAddnewUser }) => {

    const { data: allUsersWithCategory } = useQuery({
        queryKey: ["allUsersWithCategory"],
        queryFn: () =>
            getWithQueryApiServices(
                apiRoutes.GET_ALL_USER_WITH_CATEGORY,
                `pageNumber=1&selectedCompany=1`
            ),
    });

    const { data: allUserAccess } = useQuery({
        queryKey: ["allUserAccess"],
        queryFn: () =>
            getWithQueryApiServices(
                apiRoutes.GET_ALL_ACCESS_OF_USER,
                `selectedCompany=1`
            ),
    });

    const enableDisableCompany = (companyID) => {
        let workData = [...userDetails?.accessList]
        const checkExist = workData?.some((access) => access?.companyID === companyID)

        if (checkExist) {
            workData = workData?.filter((item) => item?.companyID !== companyID)
        } else {
            workData = [...workData, { companyID, levelList: [...allUserAccess?.data], categoryList: [] }]
        }

        setUserDetails({ ...userDetails, accessList: [...workData] })
    }

    const categoryOnchange = (companyID, category) => {
        let workData = [...userDetails?.accessList]
        let getCompany = workData?.find((item) => item?.companyID === companyID)
        const isCategoryExist = getCompany?.categoryList?.some((cat) => cat === category)

        if (isCategoryExist) {
            getCompany = { ...getCompany, categoryList: getCompany?.categoryList?.filter((item) => item !== category) }
        } else {
            getCompany = { ...getCompany, categoryList: [...getCompany?.categoryList, category] }
        }

        workData = workData?.map((item) => {
            if (item?.companyID === companyID) {
                return getCompany
            }
            return item
        })

        setUserDetails({ ...userDetails, accessList: [...workData] })
    }

    const isCategoryChecked = (companyID, category) => {
        let workData = [...userDetails?.accessList]
        let getCompany = workData?.find((item) => item?.companyID === companyID)
        return getCompany?.categoryList?.some((item) => item === category) || false
    }

    const isCompanyChecked = (companyID) => {
        return userDetails?.accessList?.some((access) => companyID === access?.companyID)
    }


    return (
        <BoxContainer style={{ pointerEvents: !addNewUser ? "none" : "auto", }}>
            {
                allUsersWithCategory?.data?.map((item) =>
                (<CompanyBox>

                    <CompanyTitle>
                        {item?.name}
                        <HeaderBox>
                            <FormGroup>
                                <FormControlLabel control={<Switch size="small" checked={isCompanyChecked(item?.companyID)} onChange={() => enableDisableCompany(item?.companyID)} name='enableDisable' />} label={isCompanyChecked(item?.companyID) ? "Enable" : "Disabled"} />
                            </FormGroup>
                            <FormGroup style={{ padding: "8px 0" }}>
                                <FormControlLabel control={<Switch size="small" checked={item?.companyID === userDetails?.defaultcompany} onChange={() => setUserDetails({ ...userDetails, defaultcompany: item?.companyID })} name='defaultcompany' />} label="Set Default" />
                            </FormGroup>
                        </HeaderBox>
                    </CompanyTitle>
                    <div style={{
                        overflowY: "scroll", height: "90%", pointerEvents: !isCompanyChecked(item?.companyID) ? "none" : "auto",
                        backgroundColor: !isCompanyChecked(item?.companyID) ? "#f0f0f0" : "white",
                        opacity: !isCompanyChecked(item?.companyID) ? "0.6" : "1",
                    }}>

                        {
                            item?.categories?.map((category) => (
                                <ListBox>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={isCategoryChecked(item?.companyID, category)}
                                                onChange={() => categoryOnchange(item?.companyID, category)}
                                            />
                                        }
                                        label={category}
                                    />
                                </ListBox>
                            ))
                        }
                    </div>
                </CompanyBox>))
            }
        </BoxContainer>
    )
}
