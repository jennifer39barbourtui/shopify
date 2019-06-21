import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { createStyles, Theme, makeStyles, useTheme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import { connect } from 'react-redux';
import services from '../../services';
import { CheckoutState } from '../../store/checkout.slice';
import withLayout from '../../hocs/withLayout';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%'
    },
    paper: {
      marginTop: theme.spacing(3),
      width: '100%',
      overflowX: 'auto',
      marginBottom: theme.spacing(2)
    },
    table: {
      minWidth: 650
    },
    quantityInput: {
      maxWidth: 45
    },
    emptyCart: {
      textAlign: 'center'
    },
    checkout: {
      // textAlign: 'right'
    },
    loader: {
      display: 'block',
      width: '100%',
      textAlign: 'center',
      marginBottom: 30
    }
  })
);

interface Props {
  checkout?: CheckoutState;
  dispatch?: Function;
}

function Cart(props: Props) {
  const { loading, error, data } = props.checkout;
  const theme = useTheme();
  const classes = useStyles(theme);

  if (loading) {
    return (
      <div className={classes.loader}>
        <CircularProgress size={24} />
      </div>
    );
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (data === null) {
    return <p className={classes.emptyCart}>Your cart is empty.</p>;
  }

  return (
    <div className={classes.root}>
      <h1>Your Cart</h1>
      <Paper className={classes.paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Product Variants</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.lineItems.edges.map(({ node }) => (
              <TableRow key={node.id}>
                <TableCell component="th" scope="row">
                  {node.title} ({node.variant.title})
                </TableCell>
                <TableCell align="right">
                  <TextField
                    className={classes.quantityInput}
                    defaultValue={node.quantity}
                    onChange={event =>
                      props.dispatch(services.checkout.updateQuantity(node.variant.id, parseInt(event.target.value)))
                    }
                    type="number"
                    margin="normal"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => props.dispatch(services.checkout.removeLineItem(node.variant.id))}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <div className={classes.checkout}>
        <p>
          Subtotal: ${data.subtotalPriceV2.amount} <br />
          Taxes: ${data.totalTaxV2.amount} <br />
          Total ${data.totalPriceV2.amount}
        </p>
        <Button variant="contained" color="primary" href={data.webUrl}>
          Checkout
        </Button>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return { checkout: state.checkout };
}

export default connect(mapStateToProps)(withLayout(Cart));