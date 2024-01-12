import React, { useState } from "react";
import { ParentPageWrapper } from "../../shared/ParentPageWrapper";
import styled from "@emotion/styled";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  Switch,
  Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { CommonSearch } from "../../shared/CommonSearch";
import { CustomTextField } from "../../shared/CustomTextField";
import { CustomSelectField } from "../../shared/CustomSelectField";
import PersonIcon from "@mui/icons-material/Person";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  deleteApiServices,
  getApiServices,
  getWithQueryApiServices,
  postApiServices,
  putApiServices,
} from "../../../apis/api";
import { apiRoutes } from "../../../apis/apiPath";
import { companyFormInitVal } from "../../../constants";
import { successToast } from "../../../utils/helper";

const BoxContainer = styled(Box)(({ theme }) => ({
  padding: "1%",
  boxSizing: "border-box",
}));

const SplitContainer = styled(Box)(({ theme }) => ({
  minHeight: "100%",
  width: "35%",
  backgroundColor: "white",
  borderRadius: 14,
  boxSizing: "border-box",
  position: "relative",
}));

// const demoValues = [
//   1, 2, 3, 4, 5, 6, 4, 3, 2, 34, 3, 3, 3, 5, 3, 2, 5, 3, 2, 5, 3,
// ];

export const Index = () => {
  const [searchCompany, setSearchCompany] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [companyForm, setCompanyForm] = useState(companyFormInitVal);

  const handleCompanyCheckbox = (val) => {
    setCompanyForm({ ...val });
  };

  const formHandleChange = (name, value) => {
    setCompanyForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const sumbitCompanyForm = () => {
    const fieldCheck = Object.values(companyForm)?.every((val) => val !== "");
    if (!fieldCheck) {
      return alert("Please fill all the fields");
    }

    if (companyForm?.companyID) {
      updateCompanyForm.mutate();
    } else {
      createCompanyForm.mutate();
    }
  };

  const createCompanyForm = useMutation({
    mutationKey: ["createCompanyform"],
    mutationFn: () => postApiServices(apiRoutes.CREATE_COMPANY, companyForm),
    onSuccess: () => {
      companyListRefetch();
      setCompanyForm(companyFormInitVal);
      successToast("Company added Successfully");
    },
  });

  const updateCompanyForm = useMutation({
    mutationKey: ["updateCompanyform"],
    mutationFn: () => putApiServices(apiRoutes.UPDATE_COMPANY, companyForm),
    onSuccess: () => {
      companyListRefetch();
      setCompanyForm(companyFormInitVal);
      successToast("Company Updated Successfully");
    },
  });

  const deleteCompany = useMutation({
    mutationKey: ["deleteCompanyDetails"],
    mutationFn: (companyID) =>
      deleteApiServices(apiRoutes.DELETE_COMPANY, companyID),
    onSuccess: () => {
      companyListRefetch();
      setCompanyForm(companyFormInitVal);
      successToast("Company Deleted!");
    },
  });

  const { data, refetch: companyListRefetch } = useQuery({
    queryKey: ["companyLists", searchCompany],
    queryFn: () =>
      getWithQueryApiServices(
        apiRoutes.GET_COMPANY_LIST,
        `pageNumber=1&search=${searchCompany}`
      ),
  });

  const { data: timezoneData } = useQuery({
    queryKey: ["timezoneList"],
    queryFn: () => getApiServices(apiRoutes.GET_TIMEZONES),
  });

  const { data: usersData } = useQuery({
    queryKey: ["usersList", companyForm, searchUser],
    queryFn: () =>
      getWithQueryApiServices(
        apiRoutes.GET_USERS_LIST,
        `pageNumber=1&selectedCompany=${companyForm?.companyID}&search=${searchUser}`
      ),
    enabled: !!companyForm?.companyID,
  });

  return (
    <ParentPageWrapper>
      <BoxContainer>
        <Typography
          style={{ fontSize: 20, fontWeight: "bold", color: "white" }}
        >
          Companies
        </Typography>
        <Box
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <SplitContainer>
            <div style={{ height: "80vh" }}>
              <Box
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxSizing: "border-box",
                  marginLeft: "24px",
                }}
              >
                <CommonSearch
                  value={searchCompany}
                  handleChange={(e) => setSearchCompany(e.target.value)}
                />
                <Typography
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    margin: "20px 0",
                    marginRight: "12%",
                  }}
                >
                  Actions
                </Typography>
              </Box>
              <div
                style={{
                  overflowY: "scroll",
                  height: "74%",
                }}
              >
                <FormGroup>
                  {data?.data?.list?.map((item, i) => (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        borderTopWidth: 1,
                        borderTopStyle: "solid",
                        borderTopColor: "#bdbdbd",
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={item?.companyID === companyForm?.companyID}
                            onChange={() =>
                              item?.companyID === companyForm?.companyID
                                ? handleCompanyCheckbox({})
                                : handleCompanyCheckbox(item)
                            }
                          />
                        }
                        label={item?.name}
                        style={{ marginLeft: "12px" }}
                      />
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "36%",
                          marginRight: 18,
                        }}
                      >
                        <Switch />
                        <IconButton
                          onClick={() =>
                            item?.companyID &&
                            deleteCompany.mutate(item?.companyID)
                          }
                        >
                          <DeleteOutlineIcon
                            style={{ color: "#4b4b4c", fontSize: 26 }}
                          />
                        </IconButton>
                        <AddToPhotosOutlinedIcon
                          style={{ color: "#4b4b4c", fontSize: 26 }}
                        />
                      </div>
                    </div>
                  ))}
                </FormGroup>
              </div>

              <Button
                variant="contained"
                startIcon={<AddOutlinedIcon />}
                style={{ position: "absolute", bottom: 35, marginLeft: "24px" }}
              >
                Add Company
              </Button>
            </div>
          </SplitContainer>
          <SplitContainer style={{ width: "25%" }}>
            <div
              style={{
                height: "80vh",
                padding: 40,
                boxSizing: "border-box",
              }}
            >
              <Typography
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  margin: "20px 0",
                }}
              >
                Company Name
              </Typography>
              <CustomTextField
                name="name"
                value={companyForm?.name}
                onChange={(e) =>
                  formHandleChange(e.target.name, e.target.value)
                }
              />

              <Typography
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  margin: "20px 0",
                }}
              >
                Time Zone
              </Typography>
              <CustomSelectField
                style={{ width: "100%" }}
                name="timezone"
                inputValues={timezoneData?.data || []}
                accept="fullname"
                value={companyForm?.timezone}
                onChange={(e) =>
                  formHandleChange(e.target.name, e.target.value)
                }
              />

              <Typography
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  margin: "20px 0",
                }}
              >
                Network Settings
              </Typography>
              <CustomTextField
                name="ip"
                value={companyForm?.ip}
                onChange={(e) =>
                  formHandleChange(e.target.name, e.target.value)
                }
              />

              <FormGroup style={{ margin: "20px 0" }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="dst"
                      checked={companyForm?.dst}
                      onChange={(e) =>
                        formHandleChange(
                          e.target.name,
                          e.target.checked ? 1 : 0
                        )
                      }
                    />
                  }
                  label={`Observe Daylight Savings`}
                />
              </FormGroup>

              <Button
                variant="contained"
                style={{ position: "absolute", bottom: 35 }}
                onClick={sumbitCompanyForm}
              >
                {companyForm?.companyID ? "Save Settings" : "Add Company"}
              </Button>
            </div>
          </SplitContainer>
          <SplitContainer>
            <div
              style={{
                height: "80vh",
                padding: 20,
                boxSizing: "border-box",
              }}
            >
              <Typography
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  margin: "20px 0",
                }}
              >
                Add Users to Company {companyForm?.name}
              </Typography>
              <CommonSearch
                style={{ width: "100%" }}
                label={"All Users"}
                value={searchUser}
                handleChange={(e) => setSearchUser(e.target.value)}
              />
              <div
                style={{
                  height: "57vh",
                  overflowY: "scroll",
                  marginTop: 20,
                }}
              >
                {usersData?.data?.userList?.map((user, i) => (
                  <div
                    style={{
                      display: "flex",
                      padding: 10,
                      alignItems: "center",
                      borderTopWidth: 1,
                      borderTopStyle: "solid",
                      borderTopColor: "#bdbdbd",
                    }}
                  >
                    <PersonIcon
                      style={{
                        color: "#4b4b4c",
                        fontSize: 26,
                        marginRight: 20,
                      }}
                    />
                    <Typography>{user?.username} </Typography>
                  </div>
                ))}
              </div>
            </div>
          </SplitContainer>
        </Box>
      </BoxContainer>
    </ParentPageWrapper>
  );
};
