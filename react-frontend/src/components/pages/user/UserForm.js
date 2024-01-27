import React from 'react'
import { StyledTypography } from '../../../styles/commonStyles'
import { CustomTextField } from '../../shared/CustomTextField'
import { Button, FormControlLabel, FormGroup, Switch } from '@mui/material';
import { userFormInitVal } from '../../../constants';
import { useMutation } from '@tanstack/react-query';
import { deletewithQueryApiServices, postWithQueryApiServices, putWithQueryApiServices } from '../../../apis/api';
import { apiRoutes } from '../../../apis/apiPath';
import { successToast } from '../../../utils/helper';
import Cookies from 'universal-cookie';

export const UserForm = ({ userDetails, setUserDetails, addNewUser, setAddnewUser, userListRefetch, setSelectedUser, seelctedUser }) => {
    const cookies = new Cookies();
    const defaultcompany = cookies.get("defaultcompany");

    const formHandleChange = (name, value) => {
        setUserDetails((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    const deleteUser = useMutation({
        mutationKey: ["deleteUser"],
        mutationFn: (seelctedUser) =>
            deletewithQueryApiServices(apiRoutes.DELETE_USER_BY_ID, `selectedCompany=${defaultcompany}`, seelctedUser),
        onSuccess: () => {
            userListRefetch();
            setAddnewUser(false)
            setSelectedUser("")
            setUserDetails(userFormInitVal);
            successToast("User Deleted!");
        },
    });

    const createNewUser = useMutation({
        mutationKey: ["createNewUser"],
        mutationFn: () => postWithQueryApiServices(apiRoutes.CREATE_USER,
            `selectedCompany=${defaultcompany}`,
            userDetails,
        ),
        onSuccess: () => {
            userListRefetch();
            setAddnewUser(false)
            setSelectedUser("")
            setUserDetails(userFormInitVal);
            successToast("User Created Successfully");
        },
    });

    const updateUserDetails = useMutation({
        mutationKey: ["updateUserDetails"],
        mutationFn: () => putWithQueryApiServices(
            apiRoutes.UPDATE_USER_BY_ID,
            `selectedCompany=${defaultcompany}`,
            userDetails
        ),
        onSuccess: () => {
            userListRefetch();
            setAddnewUser(false)
            setSelectedUser("")
            setUserDetails(userFormInitVal);
            successToast("User Updated Successfully");
        },
    });


    const handleSubmit = () => {
        if (userDetails?.userID) {
            updateUserDetails.mutate()
        } else {
            createNewUser.mutate()
        }
    }

    return (
        <div
            style={{
                padding: "4px 40px",
                boxSizing: "border-box",
                borderRadius: 14,
                pointerEvents: !addNewUser ? "none" : "auto",
                backgroundColor: !addNewUser ? "#f0f0f0" : "white",
                opacity: !addNewUser ? "0.6" : "1",
            }}
        >
            <StyledTypography>User Name</StyledTypography>
            <CustomTextField
                name="username"
                value={userDetails?.username}
                onChange={(e) => formHandleChange(e.target.name, e.target.value)}
            />

            <StyledTypography>Email</StyledTypography>
            <CustomTextField
                name="title"
                value={userDetails?.title}
                onChange={(e) => formHandleChange(e.target.name, e.target.value)}
            />

            <StyledTypography>Password</StyledTypography>
            <CustomTextField
                name="password"
                type="password"
                value={userDetails?.password}
                onChange={(e) => formHandleChange(e.target.name, e.target.value)}
            />

            <StyledTypography>Network Settings</StyledTypography>
            <CustomTextField
                name="ip"
                value={userDetails?.ip}
                onChange={(e) => formHandleChange(e.target.name, e.target.value)}
            />

            <FormGroup>
                <FormControlLabel control={<Switch
                    name="issysadm"
                    onChange={(e) => formHandleChange(e.target.name, e.target.checked ? 1 : 0)}
                    checked={userDetails?.issysadm == 1 ? true : false}
                />} label="Make System Admin" />
            </FormGroup>

            <FormGroup>
                <FormControlLabel control={<Switch
                    name="isActive"
                    onChange={(e) => formHandleChange(e.target.name, e.target.checked ? 1 : 0)}
                    checked={userDetails?.isActive == 1 ? true : false}
                />} label="Active" />
            </FormGroup>

            <div
                style={{
                    height: "12%",
                    position: "absolute",
                    bottom: 0,
                }}
            >
                <Button
                    variant="contained"
                    style={{ marginRight: 20 }}
                    onClick={handleSubmit}
                >
                    {userDetails?.userID ? "Save Settings" : "Add User"}
                </Button>
                {userDetails?.userID ? (
                    <Button
                        variant="contained"
                        onClick={() => {
                            deleteUser.mutate(seelctedUser);
                        }}
                    >
                        Delete User
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        onClick={() => {
                            setUserDetails(userFormInitVal);
                            setAddnewUser(false)
                            setSelectedUser("")
                        }}
                    >
                        Cancel
                    </Button>
                )}
            </div>

        </div>
    )
}
