import React, {useEffect, useState} from "react";
import {
    Box,
    Container,
    Paper,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
    Alert, Avatar
} from "@mui/material";
import DeleteArticle from "./deleteArticle";
import NewArticle from "./newArticle";
import EditArticle from "./editArticle";
import axios from "axios";


function Article() {

    document.title = 'Page des articles';

    const [data, setData] = useState(null); // array of data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // WIP
    const [toast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState({});

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (article, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (article) => {
        setRowsPerPage(+article.target.value);
        setPage(0);
    };

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/articles').then((actualData) => {
            actualData = actualData.data;
            setLoading(true)
            setData(actualData.data);
            setError(null);
        }).catch((err) => {
            setError(err.message);
            setData(null);
        }).finally(() => {
            setLoading(false);
        });
    }, []);

    const handleDataChange = async (dataChange, message) => {
        await setData(dataChange)
        if (message && message === 'edit'){
            setToastMessage({message: "Article modifié !", severity: "success"});
            setShowToast(true);
        } else if(message && message === 'delete') {
            setToastMessage({message: "Article supprimé !", severity: "success"});
            setShowToast(true);
        }
    }

    return <Container maxWidth="xl" id="Article">
        <Paper sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', py: 10}}>
            <Typography variant="h3" sx={{textAlign: "center"}} gutterBottom>Articles</Typography>
            {loading ? (
                <Typography variant="h5" sx={{textAlign: "center"}} gutterBottom>Chargement des articles...</Typography>
            ) : (
                <Box sx={{ maxWidth: '90%' }}>
                    <NewArticle newValue={{data}} handleDataChange={handleDataChange} />
                    <TableContainer sx={{ mt:4 }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell key={1}>ID</TableCell>
                                    <TableCell key={2}>Nom de l'article</TableCell>
                                    <TableCell key={3}>Contenu</TableCell>
                                    <TableCell key={4}>image</TableCell>
                                    <TableCell key={5}>Categorie</TableCell>
                                    <TableCell key={6}>Lieu</TableCell>
                                    <TableCell key={7} align={'right'}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(({id, name_article, content_article, image, category, place}) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={name_article+id}>
                                            <TableCell>{id}</TableCell>
                                            <TableCell sx={{fontWeight: 'bold'}}>{name_article.slice(0,20) ?? '--'}</TableCell>
                                            <TableCell sx={{fontWeight: 'bold'}}>{content_article.slice(0,40) ?? '--'}</TableCell>
                                            <TableCell sx={{fontWeight: 'bold'}}>
                                                { image ? (
                                                    <Box component="img" src={`http://127.0.0.1:8000/storage/uploads/articles/${image}`} alt={image} sx={{ width: "80px" }}/>
                                                ) : (
                                                    '--'
                                                ) }
                                            </TableCell>
                                            <TableCell sx={{fontWeight: 'bold'}}>{category.category ?? '--'} {category.category_name ?? '--'}</TableCell>
                                            <TableCell sx={{fontWeight: 'bold'}}>{place.name_place ?? '--'}</TableCell>
                                            <TableCell>
                                                <Box sx={{display: 'flex', justifyContent: 'right'}}>
                                                    <EditArticle updateValue={{id, name_article, content_article, image, category, place, data}} handleDataChange={handleDataChange} />
                                                    <DeleteArticle deleteValue={{id, name_article, data}} handleDataChange={handleDataChange}/>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={data.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Box>
            )}
        </Paper>

        <Snackbar
            open={toast}
            autoHideDuration={3000}
            onClose={() => setShowToast(false)}
            anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
        >
            <Alert onClose={() => setShowToast(false)} severity={toastMessage.severity} sx={{width: '100%'}}>
                {toastMessage.message}
            </Alert>
        </Snackbar>
    </Container>
}

export default Article;