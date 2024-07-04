import React, { useEffect, useState, useRef } from 'react';
import Select from 'react-select';
import axios from 'axios';
import _debounce from 'lodash/debounce';
import { Button } from '@mui/material';

const FileManager = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedContact, setSelectedContact] = useState('');
    const [downloadLink, setDownloadLink] = useState('');

    const debouncedFetchData = useRef(_debounce(async (query) => {
        try {
            const response = await axios.get(`http://shidcoccm.ir/api/search?query=${query}`);
            setSearchResults(response.data);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    }, 300)).current;

    const selectedContactOnScreen = (option) => {
        setSelectedContact(option);
        console.log(option);
    };

    useEffect(() => {
        if (searchQuery.trim() !== '') {
            debouncedFetchData(searchQuery);
        }

        return () => {
            debouncedFetchData.cancel();
        };
    }, [searchQuery, debouncedFetchData]);

    const searchForFile = async () => {
        try {
          const response = await axios.post("http://shidcoccm.ir/api/getfilesuser", {
            user: selectedContact.value
        }, {
            responseType: 'blob',
            headers: {
                'Content-Type': 'application/json'
            }
        });
            console.log(response)
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            setDownloadLink(url);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <div style={{ display: "flex" }}></div>
            <Select
                styles={{ width: "100%" }}
                inputValue={searchQuery}
                onInputChange={(e) => setSearchQuery(e)}
                value={selectedContact}
                onChange={(option) => selectedContactOnScreen(option)}
                options={searchResults.map(result => ({ label: result.FullName, value: result.Email }))}
                isSearchable
                placeholder="جست و جوی کاربر..."
            />
            <Button onClick={searchForFile} variant='contained'>جست و جو</Button>
            {downloadLink && (
                <a href={downloadLink} download="file.pdf">Download File</a>
            )}
        </div>
    );
};

export default FileManager;
