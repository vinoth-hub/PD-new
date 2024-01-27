import React, { useEffect, useState } from 'react'
import { ListBox, SplitContainer, StyledHeader, StyledTypography } from '../../../styles/commonStyles'
import styled from '@emotion/styled';
import { Box, Button, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getWithQueryApiServices } from '../../../apis/api';
import { apiRoutes } from '../../../apis/apiPath';
import { UserForm } from './UserForm';
import { userFormInitVal } from '../../../constants';
import { AccessList } from './AccessList';
import Cookies from 'universal-cookie';

const BoxContainer = styled(Box)(({ theme }) => ({
    padding: "1%",
    boxSizing: "border-box",
}));

const ParentContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxSizing: "border-box",
}));

const ActionContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxSizing: "border-box",
    marginLeft: "24px",
}));

const CompanyContainer = styled(Box)(({ theme }) => ({
    height: "700px", width: "100%", marginTop: 20, backgroundColor: "#f1f1f1", borderRadius: 14
}));

export const User = () => {
    const cookies = new Cookies();
    const defaultcompany = cookies.get("defaultcompany");
    const [seelctedUser, setSelectedUser] = useState("")
    const [addNewUser, setAddnewUser] = useState(false)
    const [userDetails, setUserDetails] = useState(userFormInitVal)

    const { data: allUsersList, refetch: userListRefetch } = useQuery({
        queryKey: ["usersList"],
        queryFn: () =>
            getWithQueryApiServices(
                apiRoutes.GET_ALL_USERS_LIST,
                `pageNumber=1`
            ),
    });

    const { data: getUserDetails } = useQuery({
        queryKey: ["getUserDetails", seelctedUser],
        queryFn: () =>
            getWithQueryApiServices(
                `${apiRoutes.GET_USER_DETAILS_BY_ID}/${seelctedUser}`,
                `selectedCompany=${defaultcompany}`
            ),
        enabled: !!seelctedUser
    });

    useEffect(() => {
        if (getUserDetails?.data?.userID) {
            setUserDetails(getUserDetails?.data)
            setAddnewUser(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getUserDetails?.data?.userID])


    return (
        <Box style={{ backgroundColor: "#7285b3", }}>
            <BoxContainer>
                <StyledHeader>User Settings and Permission</StyledHeader>
                <ParentContainer>

                    <SplitContainer style={{ width: "46%", height: "600px" }}>
                        <ActionContainer>
                            <StyledTypography style={{ marginRight: "12%" }}>
                                User List
                            </StyledTypography>

                            <Button
                                variant="contained"
                                onClick={() => setAddnewUser(true)}
                                style={{ marginRight: "4%" }}

                            >Add New User</Button>
                        </ActionContainer>

                        <div
                            style={{
                                overflowY: "scroll",
                                height: "74%",
                                margin: "0 2%"
                            }}
                        >
                            <RadioGroup value={seelctedUser}>
                                {
                                    allUsersList?.data?.userList?.map((item) => (
                                        <ListBox>
                                            <FormControlLabel
                                                value={item?.userID}
                                                control={<Radio onChange={() => setSelectedUser(item?.userID)} />}
                                                label={item?.username} />
                                        </ListBox>
                                    ))
                                }
                            </RadioGroup>
                        </div>

                    </SplitContainer>
                    <SplitContainer style={{ width: "46%", height: "600px", cursor: addNewUser ? "auto" : "not-allowed" }}>
                        <UserForm userDetails={userDetails} setUserDetails={setUserDetails}
                            addNewUser={addNewUser} setAddnewUser={setAddnewUser}
                            userListRefetch={userListRefetch} setSelectedUser={setSelectedUser} seelctedUser={seelctedUser}
                        />

                    </SplitContainer>
                </ParentContainer>
                <CompanyContainer style={{ cursor: addNewUser ? "auto" : "not-allowed" }}>
                    <AccessList userDetails={userDetails} setUserDetails={setUserDetails}
                        addNewUser={addNewUser} setAddnewUser={setAddnewUser}
                    />
                </CompanyContainer>
            </BoxContainer>
        </Box>
    )
}
