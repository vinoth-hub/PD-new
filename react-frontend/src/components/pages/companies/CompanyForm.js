import React from "react";
import { StyledTypography } from "../../../styles/commonStyles";
import { CustomTextField } from "../../shared/CustomTextField";
import { CustomSelectField } from "../../shared/CustomSelectField";
import { Button, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { companyFormInitVal } from "../../../constants";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRoutes } from "../../../apis/apiPath";
import {
  getApiServices,
  postApiServices,
  putApiServices,
} from "../../../apis/api";
import { errorToast, successToast } from "../../../utils/helper";

export const CompanyForm = ({
  companyForm,
  addNewCompany,
  setAddNewCompany,
  setCompanyForm,
  companyListRefetch,
}) => {
  const formHandleChange = (name, value) => {
    setCompanyForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const sumbitCompanyForm = () => {
    const fieldCheck = Object.values(companyForm)?.every((val) => val !== "");
    if (!fieldCheck) {
      return errorToast("Please fill all the fields");
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
      setAddNewCompany(false)
      setCompanyForm(companyFormInitVal);
      successToast("Company added Successfully");
    },
  });

  const updateCompanyForm = useMutation({
    mutationKey: ["updateCompanyform"],
    mutationFn: () => putApiServices(apiRoutes.UPDATE_COMPANY, companyForm),
    onSuccess: () => {
      companyListRefetch();
      setAddNewCompany(false)
      setCompanyForm(companyFormInitVal);
      successToast("Company Updated Successfully");
    },
  });

  const { data: timezoneData } = useQuery({
    queryKey: ["timezoneList"],
    queryFn: () => getApiServices(apiRoutes.GET_TIMEZONES),
  });

  return (
    <div
      style={{
        height: "80vh",
        padding: "4px 40px",
        boxSizing: "border-box",
        borderRadius: 14,
        pointerEvents: !addNewCompany ? "none" : "auto",
        backgroundColor: !addNewCompany ? "#f0f0f0" : "white",
        opacity: !addNewCompany ? "0.6" : "1",
      }}
    >
      <StyledTypography>Company Name</StyledTypography>
      <CustomTextField
        name="name"
        value={companyForm?.name}
        onChange={(e) => formHandleChange(e.target.name, e.target.value)}
      />

      <StyledTypography>Time Zone</StyledTypography>
      <CustomSelectField
        style={{ width: "100%" }}
        name="timezone"
        inputValues={timezoneData?.data || []}
        accept="fullname"
        value={companyForm?.timezone}
        onChange={(e) => formHandleChange(e.target.name, e.target.value)}
      />

      <StyledTypography>Network Settings</StyledTypography>
      <CustomTextField
        name="ip"
        value={companyForm?.ip}
        onChange={(e) => formHandleChange(e.target.name, e.target.value)}
      />

      <FormGroup style={{ margin: "20px 0" }}>
        <FormControlLabel
          control={
            <Checkbox
              name="dst"
              checked={companyForm?.dst}
              onChange={(e) =>
                formHandleChange(e.target.name, e.target.checked ? 1 : 0)
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
  );
};
