import React, { useState, useEffect } from "react";
import qs from "query-string";
import * as Yup from "yup";
import { useHistory, Link as RouterLink } from "react-router-dom";
import { toast } from "react-toastify";
import { Formik, Form, Field } from "formik";
import usePlans from "../../hooks/usePlans";

import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  Container,
  Typography,
  makeStyles
} from "@material-ui/core";

import InputMask from "react-input-mask";
import logo from "../../assets/logo.png";
import { i18n } from "../../translate/i18n";
import { openApi } from "../../services/api";
import toastError from "../../errors/toastError";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

const UserSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, i18n.t("signup.formErrors.name.short"))
    .max(50, i18n.t("signup.formErrors.name.long"))
    .required(i18n.t("signup.formErrors.name.required")),
  password: Yup.string()
    .min(5, i18n.t("signup.formErrors.password.short"))
    .max(50, i18n.t("signup.formErrors.password.long")),
  email: Yup.string()
    .email(i18n.t("signup.formErrors.email.invalid"))
    .required(i18n.t("signup.formErrors.email.required"))
});

const SignUp = () => {
  const classes = useStyles();
  const history = useHistory();

  // pega ?companyId=...
  const params = qs.parse(window.location.search);
  const companyId = params.companyId || null;

  const initialState = {
    name: "",
    email: "",
    phone: "",
    password: "",
    planId: ""
  };

  const [plans, setPlans] = useState([]);
  const { list: listPlans } = usePlans();

  useEffect(() => {
    (async () => {
      try {
        const list = await listPlans(companyId);
        // só setamos se for array
        if (Array.isArray(list)) {
          setPlans(list);
        } else {
          console.warn("listPlans retornou não-array:", list);
        }
      } catch (err) {
        toastError(err);
      }
    })();
  }, [companyId, listPlans]);

  const dueDate = moment().add(3, "day").toISOString();

  const handleSignUp = async (values) => {
    try {
      const payload = {
        ...values,
        recurrence: "MENSAL",
        dueDate,
        status: "t",
        campaignsEnabled: true,
        companyId
      };
      await openApi.post("/companies/cadastro", payload);
      toast.success(i18n.t("signup.toasts.success"));
      history.push("/login");
    } catch (err) {
      toastError(err);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />

      <div className={classes.paper}>
        <img src={logo} alt="Logo" style={{ width: "70%" }} />

        <Formik
          initialValues={initialState}
          enableReinitialize
          validationSchema={UserSchema}
          onSubmit={async (values, actions) => {
            await handleSignUp(values);
            actions.setSubmitting(false);
          }}
        >
          {({ touched, errors, isSubmitting }) => (
            <Form className={classes.form}>
              <Grid container spacing={2}>
                {/* Nome */}
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="name"
                    variant="outlined"
                    fullWidth
                    label={i18n.t("signup.form.name")}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                    autoComplete="name"
                  />
                </Grid>

                {/* Email */}
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="email"
                    variant="outlined"
                    fullWidth
                    label={i18n.t("signup.form.email")}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    autoComplete="email"
                    required
                  />
                </Grid>

                {/* Telefone */}
                <Grid item xs={12}>
                  <Field
                    as={InputMask}
                    mask="(99) 99999-9999"
                    name="phone"
                    required
                  >
                    {({ field }) => (
                      <TextField
                        {...field}
                        variant="outlined"
                        fullWidth
                        label={i18n.t("signup.form.phone")}
                        inputProps={{ maxLength: 11 }}
                        error={touched.phone && Boolean(errors.phone)}
                        helperText={touched.phone && errors.phone}
                      />
                    )}
                  </Field>
                </Grid>

                {/* Senha */}
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="password"
                    variant="outlined"
                    fullWidth
                    label={i18n.t("signup.form.password")}
                    type="password"
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    autoComplete="new-password"
                    required
                  />
                </Grid>

                {/* Plano */}
                <Grid item xs={12}>
                  <FormControl variant="outlined" fullWidth required>
                    <InputLabel id="plan-label">
                      {i18n.t("signup.form.plan")}
                    </InputLabel>
                    <Field
                      as={Select}
                      labelId="plan-label"
                      name="planId"
                      label={i18n.t("signup.form.plan")}
                    >
                      {plans.length > 0 ? (
                        plans.map((plan) => (
                          <MenuItem key={plan.id} value={plan.id}>
                            {plan.name} – R$ {plan.value}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value="" disabled>
                          {companyId
                            ? "Carregando planos..."
                            : "Nenhum plano disponível"}
                        </MenuItem>
                      )}
                    </Field>
                  </FormControl>
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={isSubmitting}
              >
                {i18n.t("signup.buttons.submit")}
              </Button>

              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link
                    component={RouterLink}
                    to="/login"
                    variant="body2"
                  >
                    {i18n.t("signup.buttons.login")}
                  </Link>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </div>

      <Box mt={5}>
        <Typography variant="body2" color="textSecondary" align="center">
          {"Copyright © "}
          <Link color="inherit" href="#">
            PLW
          </Link>{" "}
          {new Date().getFullYear()}
          {"."}
        </Typography>
      </Box>
    </Container>
  );
};

export default SignUp;
