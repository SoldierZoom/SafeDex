package com.logicluminaries.safedex;

import com.logicluminaries.safedex.controller.PropertyController;
import com.logicluminaries.safedex.enums.OrderType;
import com.logicluminaries.safedex.model.PagedProperties;
import com.logicluminaries.safedex.model.Property;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import java.util.List;
import java.util.function.BiFunction;

@SpringBootTest
@TestPropertySource(locations = "classpath:application-test.properties")
class SafedexApplicationTests {
	@Autowired
	private PropertyController propertyController;

	//Filter tests
	//paging test

	//sortBy and order tests
	private <T extends Comparable<T>> void testSortByFieldWithOrder(String sortField, OrderType order, BiFunction<Property, Property, T[]> valueGetter) {
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
			System.out.println(sortField + " " + order + "- test passed!");
		} catch (AssertionError e) {
			System.out.println(sortField + " " + order + "- test failed!");
			throw e;
		}
	}
	@Test
	void sortByPrice_test() {
		System.out.println("\nSorting by Price Test");

		testSortByFieldWithOrder("price", OrderType.ASC,
				(p1, p2) -> new Float[]{p1.getPpm(), p2.getPpm()});

		testSortByFieldWithOrder("price", OrderType.DESC,
				(p1, p2) -> new Float[]{p1.getPpm(), p2.getPpm()});
	}
	@Test
	void sortBySafetyScore_test() {
		System.out.println("\nSorting by SafetyScore Test");

		testSortByFieldWithOrder("safetyScore", OrderType.ASC,
				(p1, p2) -> new Integer[]{p1.getNeighbourhood().getSafetyScore(), p2.getNeighbourhood().getSafetyScore()});

		testSortByFieldWithOrder("safetyScore", OrderType.DESC,
				(p1, p2) -> new Integer[]{p1.getNeighbourhood().getSafetyScore(), p2.getNeighbourhood().getSafetyScore()});
	}
	@Test
	void sortByDate_test() {
		System.out.println("\nSorting by Date Test");

		testSortByFieldWithOrder("date", OrderType.ASC,
				(p1, p2) -> new Long[]{p1.getId(), p2.getId()});

		testSortByFieldWithOrder("date", OrderType.DESC,
				(p1, p2) -> new Long[]{p1.getId(), p2.getId()});
	}


	//min max tests
	@Test
	void minMaxPrice_test() {
		System.out.println("\nMinMax Price Test");
		//check page count
		final int minPrice = 650, maxPrice=1000;
		int MAX_PAGES = propertyController.getProperties(1,null,minPrice,maxPrice,null,null,null,null,null,null,null,null).getTotalPages();
		try {
			for (int i = 1; i < MAX_PAGES+1; i++) {
				//between 650-1000 ppm
				PagedProperties result = propertyController.getProperties(i,null,minPrice,maxPrice,null,null,null,null,null,null,null,null);
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
	@Test
	void minMaxBedroom_test() {
		System.out.println("\nMinMax Bedroom Test");
		//check page count
		final int minBedroom = 3, maxBedroom=4;
		int MAX_PAGES = propertyController.getProperties(1,null,null,null,null,minBedroom,maxBedroom,null,null,null,null,null).getTotalPages();
		try {
			for (int i = 1; i < MAX_PAGES+1; i++) {
				//between 3-4 bedrooms
				PagedProperties result = propertyController.getProperties(i,null,null,null,null,minBedroom,maxBedroom,null,null,null,null,null);
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
	
	//housing type test
	//query test
	//test all filters together
}
