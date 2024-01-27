import React, { useEffect, useState } from "react";
import { StyledTypography } from "../../../styles/commonStyles";
import { CustomTextField } from "../../shared/CustomTextField";
import { CustomSelectField } from "../../shared/CustomSelectField";
import { useMutation } from "@tanstack/react-query";
import {
  postWithQueryApiServices,
  putWithQueryApiServices,
} from "../../../apis/api";
import { apiRoutes } from "../../../apis/apiPath";
import {
  categoryFormInitVal,
  criteriaOptions,
  expirationValues,
} from "../../../constants";
import { Button, IconButton } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { IconColor } from "../../../styles/constants";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import styled from "@emotion/styled";
import { errorToast, successToast } from "../../../utils/helper";

const StyledInput = styled("input")(({ theme }) => ({
  backgroundColor: "white",
  borderRadius: 4,
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "#bdbdbd",
  height: 26,
  margin: "0 4px 0 12px",
}));

const CriteriaOptBox = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  backgroundColor: "#f6f7fb",
  boxSizing: "border-box",
  padding: "10px 0",
  margin: "12px 0",
  borderRadius: 20,
}));

export const CategoryForm = ({
  categoryListRefetch,
  companyListRefetch,
  companyForm,
  categoryData,
  setCategoryData,
  addNewCategory,
  setAddNewCategory
}) => {
  const [categoryValues, setCategoryValues] = useState(categoryFormInitVal);
  const [criteriaValues, setCriteriaValues] = useState([]);

  const formHandleChange = (name, value) => {
    setCategoryValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addCriteria = () => {
    setCriteriaValues((prev) => [...prev, { type: "text", value: "" }]);
  };

  const removeCriteria = (index) => {
    let splicedValue = [...criteriaValues];
    splicedValue.splice(index, 1);
    setCriteriaValues(splicedValue);
  };

  const handleCriteriaChange = (name, value, index) => {
    let copyValue = [...criteriaValues];
    let workData = { ...copyValue[index], [name]: value };
    copyValue[index] = workData;
    setCriteriaValues(copyValue);
  };

  const sumbitCompanyForm = () => {
    const fieldCheck = Object.values(categoryValues)?.every(
      (val) => val !== ""
    );
    if (!companyForm?.companyID) {
      return errorToast("Select any company");
    }
    if (!fieldCheck) {
      return errorToast("Please fill all the fields");
    }

    if (categoryData?.categoryID) {
      updateCategory.mutate();
    } else {
      createCategory.mutate();
    }
  };

  const createCategory = useMutation({
    mutationKey: ["createCategoryform"],
    mutationFn: () =>
      postWithQueryApiServices(
        apiRoutes.CREATE_CATEGORY,
        `selectedCompany=${companyForm?.companyID}`,
        categoryValues
      ),
    onSuccess: ({ data }) => {
      if (criteriaValues?.length > 0 && data?.insertId) {
        let workData = {
          criteriaList: criteriaValues?.map((item) => ({
            type: item?.type,
            criteria: item?.value,
          })),
          categoryID: data?.insertId,
        };
        updateCriteriaByCategory.mutate(workData);
      } else {
        // companyListRefetch();
        setAddNewCategory(false)
        categoryListRefetch();
        successToast("Category added Successfully");
      }
      setCategoryValues(categoryFormInitVal);
    },
  });

  const updateCategory = useMutation({
    mutationKey: ["updateCategoryform"],
    mutationFn: () =>
      putWithQueryApiServices(
        apiRoutes.UPDATE_CATEGORY,
        `selectedCompany=${companyForm?.companyID}`,
        categoryValues
      ),
    onSuccess: () => {
      if (categoryData?.categoryID) {
        let workData = {
          criteriaList: criteriaValues?.map((item) => ({
            type: item?.type,
            criteria: item?.value,
          })),
          categoryID: categoryData?.categoryID,
        };
        updateCriteriaByCategory.mutate(workData);
      } else {
        // companyListRefetch();
        categoryListRefetch();
        setAddNewCategory(false)
        successToast("Category Updated Successfully");
      }
      setCategoryValues(categoryFormInitVal);
      setCategoryData({});
    },
  });

  const updateCriteriaByCategory = useMutation({
    mutationKey: ["updateCriteriaByCatId"],
    mutationFn: (workData) =>
      putWithQueryApiServices(
        apiRoutes.UPDATE_CATEGORY_CRITERIA,
        `selectedCompany=${companyForm?.companyID}`,
        workData
      ),
    onSuccess: () => {
      // companyListRefetch();
      setAddNewCategory(false)
      categoryListRefetch();
      setCriteriaValues([]);
      successToast(
        categoryData?.categoryID
          ? "Category Updated Successfully"
          : "Category added Successfully"
      );
    },
  });

  useEffect(() => {
    if (categoryData?.categoryID) {
      setCategoryValues({
        name: categoryData?.name,
        expiration: categoryData?.expiration,
        categoryID: categoryData?.categoryID,
      });

      if (categoryData?.criteriaList?.length > 0) {
        setCriteriaValues(
          categoryData?.criteriaList?.map((item) => ({
            type: isNaN(parseInt(item)) ? "text" : "number",
            value: item,
          }))
        );
      } else {
        setCriteriaValues([]);
      }
    } else {
      setCategoryValues(categoryFormInitVal);
      setCriteriaValues([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryData?.categoryID]);

  return (
    <div
      style={{
        maxHeight: "80vh",
        height: "80vh",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "92%",
          borderRadius: 10,
          padding: "2px 40px",
          boxSizing: "border-box",
          position: "relative",
          pointerEvents: !addNewCategory ? "none" : "auto",
          backgroundColor: !addNewCategory ? "#f0f0f0" : "white",
        }}
      >
        <div
          style={{
            height: "85%",
            overflowY: "scroll",
            opacity: !addNewCategory ? "0.6" : "1",
          }}
        >
          <StyledTypography>Add Category</StyledTypography>
          <StyledTypography>Category Name</StyledTypography>
          <CustomTextField
            name="name"
            value={categoryValues?.name}
            onChange={(e) => formHandleChange(e.target.name, e.target.value)}
          />

          <StyledTypography>Keep File For</StyledTypography>
          <CustomSelectField
            style={{ width: "100%" }}
            name="expiration"
            inputValues={expirationValues || []}
            accept="fullname"
            value={categoryValues?.expiration}
            onChange={(e) => formHandleChange(e.target.name, e.target.value)}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              margin: "10px 0",
            }}
          >
            <StyledTypography>Criteria</StyledTypography>

            <Button
              variant="contained"
              startIcon={<AddOutlinedIcon />}
              onClick={addCriteria}
            >
              Add New Criteria
            </Button>
          </div>

          {criteriaValues?.map((item, index) => (
            <CriteriaOptBox>
              {criteriaOptions?.map((opt, i) => (
                <>
                  <input
                    type="radio"
                    id={opt?.name + index}
                    name={opt?.name + index}
                    value={opt?.value}
                    onChange={() =>
                      handleCriteriaChange("type", opt?.value, index)
                    }
                    checked={criteriaValues[index]?.type === opt?.value}
                  />
                  <label for={opt?.name + index}>{opt?.label} </label>
                </>
              ))}
              <StyledInput
                name="value"
                type={item?.type}
                onChange={(e) =>
                  handleCriteriaChange("value", e.target.value, index)
                }
                value={criteriaValues[index]?.value}
              />
              <IconButton onClick={() => removeCriteria(index)}>
                <DeleteOutlineIcon style={{ color: IconColor, fontSize: 26 }} />
              </IconButton>
            </CriteriaOptBox>
          ))}
        </div>

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
            onClick={sumbitCompanyForm}
          >
            {categoryData?.categoryID ? "Save Settings" : "Add Category"}
          </Button>
          {!categoryData?.categoryID ? (
            <Button
              variant="contained"
              onClick={() => {
                setCategoryValues(categoryFormInitVal);
                setCriteriaValues([]);
              }}
            >
              Cancel
            </Button>
          ) : (
            <></>
          )}
        </div>
      </div>
      <Button
        variant="contained"
        startIcon={<AddOutlinedIcon />}
        onClick={() => {
          setCategoryValues(categoryFormInitVal);
          setCriteriaValues([]);
          setCategoryData({});
          setAddNewCategory(true)
        }}
        style={{ position: "absolute", bottom: 0, marginLeft: "24px" }}
      >
        Add New Category
      </Button>
    </div>
  );
};
