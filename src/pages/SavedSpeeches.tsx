import { Flex, Text, Button, Grid } from "@mantine/core";
import { IconCirclePlus, IconSearch } from "@tabler/icons-react";
import SpeechesList from "../components/Speeches/SpeechesList";
import { useEffect, useRef, useState } from "react";
import { AllParagraphProps } from "../components/Speeches/type";
import { handleGlobalException } from "../utils/error";
import { useListParagraph } from "../hooks/useParagraph";
import SelectCustom from "../components/UI/SelectCustom/SelectCustom";
import { levelSpeakData } from "../components/LoginForm/type";
import { useNavigate } from "react-router-dom";

function SavedSpeeches() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [reload, setReload] = useState(false);

  const search = {
    page: currentPage,
    perPage: 5,
    search: searchValue,
    level: filterValue,
  };
  const { fetchAllParagraph } = useListParagraph(search);
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const inputRef = useRef<HTMLInputElement | null>(null);
  const handleClear = () => {
    setSearchValue("");
  };
  useEffect(() => {
    window.addEventListener("beforeunload", handleClear);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    if (!searchValue.startsWith(" ")) {
      setSearchValue(searchValue);
    }
  };
  const navigate = useNavigate();
  const [allParagraph, setAllParagraph] = useState<AllParagraphProps>();
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    async function fetchAllParagraphData() {
      const data = await fetchAllParagraph.refetch();

      if (data.isSuccess) {
        setAllParagraph(data.data.data);
        let total = data.data.data.total;
        setTotalPages(
          total % search.perPage == 0
            ? Math.floor(total / search.perPage)
            : Math.floor(total / search.perPage) + 1
        );
      } else if (data.isError) {
        const error = data.error;
        handleGlobalException(error, () => {});
      }
    }
    fetchAllParagraphData();
  }, [searchValue, reload, filterValue, currentPage]);

  return (
    <Flex
      className="savedSpeeches"
      w="100%"
      gap="xl"
      justify="center"
      align="flex-start"
      direction="column"
      wrap="wrap"
      maw="75rem"
      m="auto"
      px="2.25rem"
    >
      <Text className="textDark" pt={10} fw={500} fz={16}>
        Saved speeches
      </Text>
      <Grid
        w="100%"
        pt="1.2rem"
        pb="1rem"
        justify="space-between"
        align="center"
      >
        <Grid.Col span="auto">
          <div
            className="search"
            style={{
              width: "16rem",
              padding: "0.7em",
              border: "0.0625rem solid #ced4da",
            }}
          >
            <input
              style={{
                fontWeight: "400",
              }}
              ref={inputRef}
              value={searchValue}
              placeholder="Search speeches"
              spellCheck={false}
              onChange={handleChange}
            />
            <IconSearch color="#AAAAAA" size="1.2rem"></IconSearch>
          </div>
        </Grid.Col>
        <Grid.Col span="content">
          {" "}
          <Flex
            gap="2rem"
            justify="flex-end"
            align="center"
            direction="row"
            wrap="wrap"
            className="levelSpeech"
          >
            <SelectCustom
              props={{
                className: "filterSelect",
                style: {
                  radius: "2rem",
                },
                data: levelSpeakData,
                clearable: true,
                placeholder: "Select a level",
                onChange: (selectedValue: string) => {
                  setFilterValue(selectedValue);
                },
              }}
            />
            <Button
              p="0 0.7rem"
              fw={500}
              fz={14}
              radius="1.5rem"
              leftIcon={<IconCirclePlus m-r="0.5rem" size="1.125rem" />}
              styles={(theme) => ({
                root: {
                  backgroundColor: theme.colors.pinkPastel[0],
                  ...theme.fn.hover({
                    backgroundColor: theme.fn.darken(
                      theme.colors.pinkPastel[0],
                      0.1
                    ),
                  }),
                },
              })}
              onClick={() => {
                navigate("/ai-room");
              }}
            >
              {" "}
              Create speech
            </Button>
          </Flex>
        </Grid.Col>
      </Grid>
      <SpeechesList
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
        allSpeeches={allParagraph}
        perPage={search.perPage}
        handleSuccess={() => {
          setReload((prev) => !prev);
        }}
      />
    </Flex>
  );
}

export default SavedSpeeches;
