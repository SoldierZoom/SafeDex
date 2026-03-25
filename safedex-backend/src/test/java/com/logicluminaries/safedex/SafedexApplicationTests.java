package com.logicluminaries.safedex;

import com.logicluminaries.safedex.controller.PropertyController;
import com.logicluminaries.safedex.enums.HouseType;
import com.logicluminaries.safedex.enums.OrderType;
import com.logicluminaries.safedex.enums.SortType;
import com.logicluminaries.safedex.model.PagedProperties;
import com.logicluminaries.safedex.model.Property;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.function.BiFunction;

import static org.hamcrest.Matchers.hasItems;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application-test.properties")
class SafedexApplicationTests {
	@Autowired
	private PropertyController propertyController;
	@Autowired
	private MockMvc mockMvc;

	//Filter tests
	@Test
	void consistency_test() {
		System.out.println("\nConsistency Test");

		List<Property> first = propertyController.getProperties(
				1, null, null, null, null,
				null, null, null, null, null,
				SortType.price, OrderType.ASC
		).getProperties();

		List<Property> second = propertyController.getProperties(
				1, null, null, null, null,
				null, null, null, null, null,
				SortType.price, OrderType.ASC
		).getProperties();

		if (!first.equals(second)) {
			throw new AssertionError("Results are not consistent across identical calls");
		}

		System.out.println("Consistency test passed!");
	}
	//paging test
	private void pagingSizes_test( ) {
		final int MAX_PAGES = 7;//cause 40 entries in db and 6 per page so 7
		final int MAX_ITEMS = 6;//cause 6 per page
		try {
			int pages = propertyController.getProperties(1, null, null, null, null, null, null, null, null, null, SortType.price,OrderType.ASC).getTotalPages();
			if(pages!=MAX_PAGES) {
				throw new AssertionError("Expected " + MAX_PAGES + " pages but got " + pages);
			}
			for(int i=1;i<MAX_PAGES;i++) {
				List<Property> result = propertyController.getProperties(i, null, null, null, null, null, null, null, null, null, SortType.price,OrderType.ASC).getProperties();
				if(result.size()!=MAX_ITEMS) {
					throw new AssertionError("Page " + i + " expected " + MAX_ITEMS + " items but got " + result.size());
				}
			}
			int lastPageSize = propertyController.getProperties(7, null, null, null, null, null, null, null, null, null, SortType.price,OrderType.ASC).getProperties().size();
			if(lastPageSize!=4) {//because 40%6=4
				throw new AssertionError("Last page expected 4 items but got " + lastPageSize);
			}
			System.out.println("Paging size - test passed!");
		}catch(AssertionError e) {
			System.out.println("Paging size - test failed: "+e.getMessage());
		}

	}
	private void pagingNoDuplicates_test() {
		List<Long> allIds = new ArrayList<>();

		int pages = propertyController.getProperties(
				1, null, null, null, null,
				null, null, null, null, null,
				SortType.price, OrderType.ASC
		).getTotalPages();

		for (int i = 1; i <= pages; i++) {
			for (Property p : propertyController.getProperties(
					i, null, null, null, null,
					null, null, null, null, null,
					SortType.price, OrderType.ASC
			).getProperties()) {

				if (allIds.contains(p.getId())) {
					throw new AssertionError("Duplicate property across pages - test failed!");
				}
				allIds.add(p.getId());
			}
		}
		System.out.println("No duplicates across pages - test passed!");
	}
	@Test
	void paging_test(){
		System.out.println("\nPaging Test");
		pagingSizes_test();
		pagingNoDuplicates_test();
	}
	//sortBy and order tests
	private <T extends Comparable<T>> void testSortByFieldWithOrder(SortType sortField, OrderType order, BiFunction<Property, Property, T[]> valueGetter) {
		final int MAX_PAGES = 7;//cause 40 entries in db and 6 per page so 7
		try {
			//go through every page
			for (int i = 1; i < MAX_PAGES+1; i++) {
				//get current page of sortField and order
				PagedProperties result = propertyController.getProperties(
						i, null, null, null, null, null, null,
						null, null, null, sortField, order
				);

				List<Property> properties = result.getProperties();
				for (int j = 0; j < properties.size() - 1; j++) {
					//gets values of current sortField to compare e.g. ppm for price, safety scores for safetyScore
					T[] pair = valueGetter.apply(properties.get(j), properties.get(j + 1));
					T current = pair[0], next = pair[1];

					boolean condition = order == OrderType.DESC
							? current.compareTo(next) >= 0
							: current.compareTo(next) <= 0;

					if (!condition) {
						throw new AssertionError();//fails test if not ASC or DESC
					}
				}
			}
			System.out.println(sortField + " " + order + " - test passed!");
		} catch (AssertionError e) {
			System.out.println(sortField + " " + order + " - test failed!");
			throw e;
		}
	}
	@Test
	void sortBy_test() {
		System.out.println("\nSorting Test");
		//price
		testSortByFieldWithOrder(SortType.price, OrderType.ASC,
				(p1, p2) -> new Float[]{p1.getPpm(), p2.getPpm()});

		testSortByFieldWithOrder(SortType.price, OrderType.DESC,
				(p1, p2) -> new Float[]{p1.getPpm(), p2.getPpm()});
		//safety score
		testSortByFieldWithOrder(SortType.safetyScore, OrderType.ASC,
				(p1, p2) -> new Integer[]{p1.getNeighbourhood().getSafetyScore(), p2.getNeighbourhood().getSafetyScore()});

		testSortByFieldWithOrder(SortType.safetyScore, OrderType.DESC,
				(p1, p2) -> new Integer[]{p1.getNeighbourhood().getSafetyScore(), p2.getNeighbourhood().getSafetyScore()});
		//date test
		testSortByFieldWithOrder(SortType.date, OrderType.ASC,
				(p1, p2) -> new Long[]{p1.getId(), p2.getId()});

		testSortByFieldWithOrder(SortType.date, OrderType.DESC,
				(p1, p2) -> new Long[]{p1.getId(), p2.getId()});
	}

	//min max tests
	private void minMaxPrice_test() {
		//check page count
		final int minPrice = 650, maxPrice=1000;
		int MAX_PAGES = propertyController.getProperties(1,null,minPrice,maxPrice,null,null,null,null,null,null,SortType.price,OrderType.ASC).getTotalPages();
		try {
			for (int i = 1; i < MAX_PAGES+1; i++) {
				//between 650-1000 ppm
				PagedProperties result = propertyController.getProperties(i,null,minPrice,maxPrice,null,null,null,null,null,null,SortType.price,OrderType.ASC);
				for (Property p : result.getProperties()) {
					if (p.getPpm() < minPrice || p.getPpm() > maxPrice) {
						throw new AssertionError();
					}
				}
			}
			System.out.println("Price filter - test passed!");
		} catch (AssertionError e) {
			System.out.println("Price filter - test failed!");
			throw e;
		}
	}
	private void minMaxBedroom_test() {
		//check page count
		final int minBedroom = 3, maxBedroom=4;
		int MAX_PAGES = propertyController.getProperties(1,null,null,null,null,minBedroom,maxBedroom,null,null,null,SortType.price,OrderType.ASC).getTotalPages();
		try {
			for (int i = 1; i < MAX_PAGES+1; i++) {
				//between 3-4 bedrooms
				PagedProperties result = propertyController.getProperties(i,null,null,null,null,minBedroom,maxBedroom,null,null,null,SortType.price,OrderType.ASC);
				for (Property p : result.getProperties()) {
					if (p.getBedrooms() < minBedroom || p.getBedrooms() > maxBedroom) {
						throw new AssertionError();
					}
				}
			}
			System.out.println("Bedroom filter - test passed!");
		} catch (AssertionError e) {
			System.out.println("Bedroom filter - test failed!");
			throw e;
		}
	}
	private void minMaxBathroom_test() {
		//check page count
		final int minBathroom = 2, maxBathroom=3;
		int MAX_PAGES = propertyController.getProperties(1,null,null,null,null,null,null,minBathroom,maxBathroom,null,SortType.price,OrderType.ASC).getTotalPages();
		try {
			for (int i = 1; i < MAX_PAGES+1; i++) {
				//between 2-3 bathrooms
				PagedProperties result = propertyController.getProperties(i,null,null,null,null,null,null,minBathroom,maxBathroom,null,SortType.price,OrderType.ASC);
				for (Property p : result.getProperties()) {
					if (p.getBathrooms() < minBathroom || p.getBathrooms() > maxBathroom) {
						throw new AssertionError();
					}
				}
			}
			System.out.println("Bathroom filter - test passed!");
		} catch (AssertionError e) {
			System.out.println("Bathroom filter - test failed!");
			throw e;
		}
	}
	private void minSafetyScore_test() {
		//check page count
		final int minSafetyScore = 50;
		int MAX_PAGES = propertyController.getProperties(1,null,null,null,minSafetyScore,null,null,null,null,null,SortType.price,OrderType.ASC).getTotalPages();
		try {
			for (int i = 1; i < MAX_PAGES+1; i++) {
				//between 2-3 bathrooms
				PagedProperties result = propertyController.getProperties(i,null,null,null,minSafetyScore,null,null,null,null,null,SortType.price,OrderType.ASC);
				for (Property p : result.getProperties()) {
					if (p.getNeighbourhood().getSafetyScore() < minSafetyScore) {
						throw new AssertionError();
					}
				}
			}
			System.out.println("SafetyScore filter - test passed!");
		} catch (AssertionError e) {
			System.out.println("SafetyScore filter - test failed!");
			throw e;
		}
	}
	@Test
	void minMax_test() throws Exception {
		System.out.println("\nMin Max Test");
		//price
		minMaxPrice_test();
		testFilter("minPrice=1000&maxPrice=650");
		//bedroom
		minMaxBedroom_test();
		testFilter("minBedrooms=3&maxBedrooms=2");
		//bathroom
		minMaxBathroom_test();
		testFilter("minBathrooms=3&maxBathrooms=2");
		//safety score
		minSafetyScore_test();
	}
	
	//housing type test
	private void testHouseType(List<HouseType> types) {
		int pages = propertyController.getProperties(1,null,null,null,null,null,null,null,null,types,SortType.price,OrderType.ASC).getTotalPages();
		try{
			for (int i = 1; i < pages+1; i++) {
				List<Property> result = propertyController.getProperties(i,null,null,null,null,null,null,null,null,types,SortType.price,OrderType.ASC).getProperties();
				for(Property p : result) {
					if(!types.contains(p.getType())) {
						throw new AssertionError();
					}
				}
			}
			System.out.println("HouseType(s): "+types.toString()+" - test passed!");
		}catch (AssertionError e) {
			System.out.println("HouseType(s): "+types.toString()+" - test failed!");
			throw e;
		}
	}
	private void houseTypeIndividual_test() {
		System.out.println("\nIndividual House Types Test");
		//for all different types
		for(HouseType type: HouseType.values()) {
			List<HouseType> typeList = new ArrayList<>();
			typeList.add(type);
			testHouseType(typeList);
		}
	}
	private void houseTypeMultiple_test() {
		System.out.println("Multiple House Types Test");
		List<HouseType> typeList = new ArrayList<>();
		typeList.add(HouseType.values()[0]);
		//test for 2,3,4 types
		for(int i=1;i<4;i++) {
			typeList.add(HouseType.values()[i]);
			testHouseType(typeList);
		}
	}
	@Test
	void houseType_test() {
		houseTypeIndividual_test();
		houseTypeMultiple_test();
	}
	//query test
	List<Long> testQuery(String query) {
		List<Long> ids = new ArrayList<>();
		int pages = propertyController.getProperties(1,query,null,null,null,null,null,null,null,null,SortType.price,OrderType.ASC).getTotalPages();
		for(int i=1;i<pages+1;i++) {
			List<Property> result = propertyController.getProperties(i,query,null,null,null,null,null,null,null,null,SortType.price,OrderType.ASC).getProperties();
			for (Property p: result) {
				ids.add(p.getId());
			}
		}
		return ids;

	}
	@Test
	void queries_test() {
		System.out.println("\nQueries Test");

		//test one word
		List<Long> expectedIds = new ArrayList<>();
		expectedIds.add(14L);
		expectedIds.add(23L);
		expectedIds.add(36L);
		List<Long> response = testQuery("no");

		Collections.sort(expectedIds);
		Collections.sort(response);
		if(expectedIds.equals(response)) {
			System.out.println("Expected ids: "+expectedIds+" Got: "+response+" - test passed!");
		} else {
			System.out.println("Expected ids: "+expectedIds+" Got: "+response+" - test failed!");
		}


		//should all be in selly oak
		response.clear();
		response = testQuery("SeLly OAK");
		try {
			for(Long id: response) {
				if (!propertyController.getPropertyById(id).getNeighbourhood().getName().equals("Selly Oak")) {
					throw new AssertionError();
				}
			}
			System.out.println("All properties in selly oak - test passed!");
		} catch (AssertionError e) {
			System.out.println("Not all properties in selly oak - test failed!");
			throw e;
		}

		//test postcode, road and neighbourhood
		expectedIds.clear();
		expectedIds.add(23L);
		response.clear();
		response = testQuery("North Road Selly Oak B29 6TL");
		if(expectedIds.equals(response)) {
			System.out.println("Expected id: 23 Got: "+response+" - test passed!");
		} else {
			System.out.println("Expected id: 23 Got: "+response+" - test failed!");
		}

		//no match
		response.clear();
		response = testQuery("zyhuji");
		if(response.equals(Collections.EMPTY_LIST)) {
			System.out.println("Got empty list - test passed!");
		} else {
			System.out.println("Expected no id Got: "+response+" - test failed!");
		}
		//no match - special chars
		response.clear();
		response = testQuery("£$%^&*");
		if(response.equals(Collections.EMPTY_LIST)) {
			System.out.println("Got empty list - test passed!");
		} else {
			System.out.println("Expected no id Got: "+response+" - test failed!");
		}
		//empty query
		response.clear();
		response=testQuery("");
		if (!response.equals(Collections.EMPTY_LIST)) {
			System.out.println("Did not get empty response - test passed!");
		} else {
			System.out.println("Empty response - test failed!");
		}
		//only spaces
		response.clear();
		response=testQuery("     ");
		if (!response.equals(Collections.EMPTY_LIST)) {
			System.out.println("Did not get empty response - test passed!");
		} else {
			System.out.println("Empty response - test failed!");
		}

	}

	//boundary tests
	private void testFilter(String filterValue) throws Exception {
		try {
			mockMvc.perform(get("/api/properties?"+filterValue))
					.andExpect(status().isBadRequest());
			System.out.println("Test: "+filterValue+" - test passed!");
		} catch (AssertionError e) {
			System.out.println("Test: "+filterValue+" - test failed!");
			throw e;
		}
	}
	@Test
	void boundary_test() throws Exception {
		//All of these expected to give bad Request
		System.out.println("\nBoundary Test");
		//page is out of bounds
		testFilter("page=0");
		testFilter("page=1000");
		//price negative
		testFilter("minPrice=-1");
		testFilter("maxPrice=-1");
		//bedroom num <1
		testFilter("minBedrooms=0");
		testFilter("maxBedrooms=0");
		//bathroom num <1
		testFilter("minBathrooms=0");
		testFilter("maxBathrooms=0");
		//wrong data type (above all use Min(1) to validate so only doing once)
		testFilter("page=e");
		//wrong data type
		testFilter("types=1");
		testFilter("sortBy=1");
		testFilter("order=1");
	}
	@Test
	void allFilters_test() throws Exception{
		System.out.println("All filters test");
		try {
			mockMvc.perform(get("/api/properties?page=1&query=n&minPrice=600&maxPrice=1000&minSafetyScore=50&minBedrooms=4&maxBedrooms=4&minBathrooms=2&maxBathrooms=3&types=SEMI_DETACHED&sortBy=price&order=ASC"))
					.andExpect(status().isOk())
					.andExpect(jsonPath("$.properties[*].id", hasItems(23, 29)));
			System.out.println("All filters - test passed!");
		} catch (AssertionError e) {
			System.out.println("All filters - test failed!");
			throw e;
		}
	}
}
